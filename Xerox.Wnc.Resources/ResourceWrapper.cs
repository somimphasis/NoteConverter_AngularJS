using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Reflection;
using System.Resources;
using Xerox.Wnc.Resources.Resources;

namespace Xerox.Wnc.Resources
{
    public static class ResourceWrapper
    {
        private static Dictionary<string, ResourceSet> _resourceSets = new Dictionary<string, ResourceSet>();
        
        static ResourceWrapper()
        {
            var binDir = Assembly.GetExecutingAssembly().CodeBase.Replace("file:///", string.Empty).Replace("/Xerox.Wnc.Resources.dll", string.Empty);

            var assemblyFiles = Directory.EnumerateFiles(binDir, "*.Resources.resources.dll", SearchOption.AllDirectories);

            foreach (var file in assemblyFiles)
            {
                var assembly = Assembly.LoadFrom(file);
                var languageCode = Directory.GetParent(file).Name;
                var resourceName = $"Xerox.Wnc.Resources.Resources.AppsResource.{languageCode}.resources";
                var resourceSet = new ResourceSet(assembly.GetManifestResourceStream(resourceName));

                _resourceSets.Add(languageCode, resourceSet);
            }
        }

        public static string GetString(string key)
        {
            ResourceSet set = null;

            var code = CultureInfo.CurrentUICulture.TwoLetterISOLanguageName;

            _resourceSets.TryGetValue(code, out set);

            if (set == null)
            {
                return AppsResource.ResourceManager.GetString(key);
            }

            return set.GetString(key);
        }
    }
}
