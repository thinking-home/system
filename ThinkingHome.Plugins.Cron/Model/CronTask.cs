using System;

namespace ThinkingHome.Plugins.Cron.Model
{
    public class CronTask
    {
		public Guid Id { get; set; }

		public string Name { get; set; }

		public string EventAlias { get; set; }

		public int? Month { get; set; }
	    
		public int? Day { get; set; }
	    
		public int? Hour { get; set; }

		public int? Minute { get; set; }

		public bool Enabled { get; set; }

	    public static string GetValueMask(int? value)
	    {
		    return value.HasValue ? value.Value.ToString() : "*";
	    }

	    public string GetPattern()
	    {
		    return string.Format(
			    "{0} {1} {2} {3} *",
			    GetValueMask(Minute),
			    GetValueMask(Hour),
			    GetValueMask(Day),
			    GetValueMask(Month));
	    }
    }
}
