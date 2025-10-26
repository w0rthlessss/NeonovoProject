using System.Security.Cryptography;
using System.Text;
public static class PasswordHasher
{
    public static string ComputeSha256Hash(string rawData)
    {
        using (var sha256 = SHA256.Create())
        {
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(rawData));
            var builder = new StringBuilder();
            foreach (var b in bytes)
                builder.Append(b.ToString("X2"));
            return builder.ToString();
        }
    }
}