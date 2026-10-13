namespace Vendor.Dependency;

public class Item { }
public interface IMarker { }
public class Base { }
public class MarkerAttribute : System.Attribute { }
public delegate Item Callback(Item input);
