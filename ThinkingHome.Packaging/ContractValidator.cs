using System.Reflection;

namespace ThinkingHome.Packaging;

public sealed record AssemblyPolicy(string Kind, string Owner);

// Все Type/Assembly поступают из MetadataLoadContext: код проверяемого пакета не исполняется.
public sealed class ContractValidator(IReadOnlyDictionary<string, AssemblyPolicy> policies)
{
    private readonly HashSet<Type> visited = [];
    private readonly SortedSet<string> errors = new(StringComparer.Ordinal);
    private const BindingFlags MEMBERS = BindingFlags.Public | BindingFlags.NonPublic |
        BindingFlags.Instance | BindingFlags.Static | BindingFlags.DeclaredOnly;

    public IReadOnlyCollection<string> Validate(Assembly assembly)
    {
        foreach (var type in assembly.GetTypes().Where(ExternallyVisible)) Visit(type, type.FullName ?? type.Name);
        foreach (var type in assembly.GetForwardedTypes()) Visit(type, "forwarded type " + type.FullName);
        Attributes(assembly.GetCustomAttributesData(), assembly.GetName().Name!);
        return errors;
    }

    private static bool ExternallyVisible(Type type) => type.IsNested
        ? (type.IsNestedPublic || type.IsNestedFamily || type.IsNestedFamORAssem) && ExternallyVisible(type.DeclaringType!)
        : type.IsPublic;

    private void Visit(Type type, string path)
    {
        if (type.HasElementType) { Visit(type.GetElementType()!, path + " -> element"); return; }
        if (type.IsFunctionPointer)
        {
            Visit(type.GetFunctionPointerReturnType(), path + " -> function result");
            foreach (var argument in type.GetFunctionPointerParameterTypes()) Visit(argument, path + " -> function argument");
            return;
        }
        if (type.IsGenericParameter)
        {
            if (!visited.Add(type)) return;
            foreach (var constraint in type.GetGenericParameterConstraints()) Visit(constraint, path + " -> constraint");
            Attributes(type.GetCustomAttributesData(), path);
            return;
        }
        if (type.IsGenericType)
        {
            foreach (var argument in type.GetGenericArguments()) Visit(argument, path + " -> generic argument " + argument.Name);
            type = type.GetGenericTypeDefinition();
        }
        var name = type.Assembly.GetName().Name!;
        if (!policies.TryGetValue(name, out var policy))
        {
            errors.Add($"{path} -> {type.FullName}: undeclared assembly {name}");
            return;
        }
        if (policy.Kind == "private")
        {
            errors.Add($"{path} -> {type.FullName}: private dependency {policy.Owner} ({name}) crosses plugin boundary");
            return;
        }
        // Контракты платформы проверяет поставщик платформы. Обход BCL здесь был бы бесконечно широким.
        if (policy.Kind == "platform" || !visited.Add(type)) return;
        if (type.BaseType != null) Visit(type.BaseType, path + " -> base");
        foreach (var contract in type.GetInterfaces()) Visit(contract, path + " -> interface");
        Attributes(type.GetCustomAttributesData(), path);
        foreach (var field in type.GetFields(MEMBERS).Where(x => x.IsPublic || x.IsFamily || x.IsFamilyOrAssembly))
        {
            Visit(field.FieldType, path + "." + field.Name);
            Modifiers(field.GetRequiredCustomModifiers(), field.GetOptionalCustomModifiers(), path + "." + field.Name);
            Attributes(field.GetCustomAttributesData(), path + "." + field.Name);
        }
        foreach (var method in type.GetMethods(MEMBERS).Cast<MethodBase>().Concat(type.GetConstructors(MEMBERS))
            .Where(x => x.IsPublic || x.IsFamily || x.IsFamilyOrAssembly))
        {
            var memberPath = path + "." + method.Name;
            Attributes(method.GetCustomAttributesData(), memberPath);
            if (method is MethodInfo info) Parameter(info.ReturnParameter, memberPath + " -> return");
            foreach (var parameter in method.GetParameters()) Parameter(parameter, memberPath + " -> " + parameter.Name);
            if (method.IsGenericMethod)
                foreach (var argument in method.GetGenericArguments()) Visit(argument, memberPath + " -> generic");
        }
        foreach (var property in type.GetProperties(MEMBERS).Where(x => x.GetAccessors(true).Any(Visible)))
            Attributes(property.GetCustomAttributesData(), path + "." + property.Name);
        foreach (var item in type.GetEvents(MEMBERS).Where(x =>
            new[] { x.GetAddMethod(true), x.GetRemoveMethod(true), x.GetRaiseMethod(true) }.Any(x => x != null && Visible(x))))
            Attributes(item.GetCustomAttributesData(), path + "." + item.Name);
    }

    private static bool Visible(MethodBase method) => method.IsPublic || method.IsFamily || method.IsFamilyOrAssembly;

    private void Parameter(ParameterInfo parameter, string path)
    {
        Visit(parameter.ParameterType, path);
        Modifiers(parameter.GetRequiredCustomModifiers(), parameter.GetOptionalCustomModifiers(), path);
        Attributes(parameter.GetCustomAttributesData(), path);
    }

    private void Modifiers(Type[] required, Type[] optional, string path)
    {
        foreach (var type in required.Concat(optional)) Visit(type, path + " -> modifier");
    }

    private void Attributes(IEnumerable<CustomAttributeData> attributes, string path)
    {
        foreach (var attribute in attributes)
        {
            Visit(attribute.AttributeType, path + " -> attribute");
            foreach (var argument in attribute.ConstructorArguments) AttributeValue(argument, path);
            foreach (var argument in attribute.NamedArguments) AttributeValue(argument.TypedValue, path);
        }
    }

    private void AttributeValue(CustomAttributeTypedArgument argument, string path)
    {
        Visit(argument.ArgumentType, path + " -> attribute argument");
        if (argument.Value is Type type) Visit(type, path + " -> typeof");
        if (argument.Value is IEnumerable<CustomAttributeTypedArgument> values)
            foreach (var value in values) AttributeValue(value, path);
    }
}
