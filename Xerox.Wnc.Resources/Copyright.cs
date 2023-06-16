namespace Xerox.Wnc.Resources
{
    public static class Copyright
    {
        public const string CopyrightYears = "2022";

        public static string GetCopyrightText(string years = CopyrightYears)
        {
            return string.Format(ResourceWrapper.GetString("SDE_COPYRIGHT_FMTSTR_XEROX"), years);
        }
    }
}
