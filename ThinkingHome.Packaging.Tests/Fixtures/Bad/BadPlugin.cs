using System;
using System.Collections.Generic;
using ThinkingHome.Core.Plugins;
using Vendor.Dependency;

[assembly: System.Runtime.CompilerServices.TypeForwardedTo(typeof(Item))]

namespace Fixture;

public class BadPlugin : PluginBase {
    public Item Direct() => null;
    public List<Item> Generic() => null;
    public Payload Nested() => null;
    public Callback Delegate() => null;
    public event Action<Item> Changed { add { } remove { } }
    public void Constrained<T>() where T : Item { }
    [Marker] public void Annotated() { }
    public void TypeAttribute([TypeMarker(typeof(Item))] object value) { }
    protected Item Protected() => null;
    protected class NestedProtected {
        public Item NestedValue;
    }
}

public class Payload {
    public Item Value;
}
public class Derived : Base { }
public class Implementation : IMarker { }
public class TypeMarkerAttribute(Type type) : Attribute { }
