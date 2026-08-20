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
            // copy-on-write: опубликованный список никогда не мутируется, поэтому читатели
            // видят консистентный снимок без блокировок (мутация List не потокобезопасна)
            return new List<T>(data) { value };
        }
    }
}
