using System.Collections.Generic;

    class downtable
    {
    public string encrypt(string data, string key)
        {
            var sourcemap = @"abcdefghijklmnopqrstuvwxyz ABCEFGHIJKLMNOPQRSTUVWXYZ`¬!£$%^&*()_+1234567890-=[]{};'#:@~,./<>?\|";
            var sourcemapc = sourcemap.ToCharArray();
            List<string> table = new List<string>();
            foreach (char letter in sourcemapc)
            {
                string le = letter.ToString();
                table.Add(le);
            }
            var datad = data;
            var ackey = key;
            var keyusage = "";
            List<string> mappedkey = new List<string>();
            var currentround = 0;
            var currentletter = 0;
            var keyd = ackey.ToCharArray();
            foreach (string item in table)
            {
                if (currentletter == ackey.Length)
                {
                    currentround = currentround + 1;
                    currentletter = 0;
                }
                var currentmapkey = keyd[currentletter];
                var currentnumber = (keyusage.Split(currentmapkey).Length - 1);
                keyusage = keyusage + currentmapkey;
                mappedkey.Add(currentmapkey + currentnumber.ToString());
                currentletter = currentletter + 1;
            }
            var datae = datad.ToCharArray();
            List<string> datamapped = new List<string>();
            foreach (char item in datae)
            {
                string le = item.ToString();
                datamapped.Add(le);
            }
            var output = "";
            foreach (string item in datamapped)
            {
                var indexintab = table.IndexOf(item);
                var mapoutput = mappedkey[indexintab] + ":";
                output = output + mapoutput;
            }
            return output;
        }
        public string decode(string data, string key)
        {
            var sourcemap = @"abcdefghijklmnopqrstuvwxyz ABCEFGHIJKLMNOPQRSTUVWXYZ`¬!£$%^&*()_+1234567890-=[]{};'#:@~,./<>?\|";
            var sourcemapc = sourcemap.ToCharArray();
            List<string> table = new List<string>();
            foreach (char letter in sourcemapc)
            {
                string le = letter.ToString();
                table.Add(le);
            }
            var datad = data;
            var ackey = key;
            var keyusage = "";
            List<string> mappedkey = new List<string>();
            var currentround = 0;
            var currentletter = 0;
            var keyd = ackey.ToCharArray();
            foreach (string item in table)
            {
                if (currentletter == ackey.Length)
                {
                    currentround = currentround + 1;
                    currentletter = 0;
                }
                var currentmapkey = keyd[currentletter];
                var currentnumber = (keyusage.Split(currentmapkey).Length - 1);
                keyusage = keyusage + currentmapkey;
                mappedkey.Add(currentmapkey + currentnumber.ToString());
                currentletter = currentletter + 1;
            }
            var datamappede = datad.Split(':');
            List<string> datamapped = new List<string>();
            foreach(string item in datamappede)
            {
                datamapped.Add(item);
            }
            var output = "";
            datamapped.RemoveAt(datamapped.IndexOf(""));
            foreach (string item in datamapped) {
                var indexintab = mappedkey.IndexOf(item);
                var mapoutput = table[indexintab];
                output = output + mapoutput;
            }
            return output;
        }
    }

