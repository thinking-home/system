using System.Collections.Generic;

namespace ThinkingHome.Core.Plugins.Utils
{
    public class ObjectSetRegistry<T> : BaseRegistry<T, IList<T>>
    {
        protected override IList<T> Add(string key, T value)
        {
            return new List<T> {value};
        }

        protected override IList<T> Update(string key, IList<T> data, T value)
        {
            data.Add(value);
            return data;
        }
    }
}
