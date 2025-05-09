using System.Security.Cryptography;

namespace Server.Helpers
{
    public class PasswordHasher
    {
        private static RandomNumberGenerator rng = RandomNumberGenerator.Create();
        private static int SaltSize = 16;
        private static int HashSize = 20;
        private static int Iterations = 10000;
        public static string HashPassword(string password)
        {
            // Generate a random salt
            var salt = new byte[SaltSize];
            rng.GetBytes(salt);

            // Create the hash
            using (var key = new Rfc2898DeriveBytes(password, salt, Iterations, HashAlgorithmName.SHA256))
            {
                var hash = key.GetBytes(HashSize);
                var hashBytes = new byte[SaltSize + HashSize];
                Array.Copy(salt, 0, hashBytes, 0, SaltSize);
                Array.Copy(hash, 0, hashBytes, SaltSize, HashSize);
                return Convert.ToBase64String(hashBytes);
            }
        }

        public static bool VerifyPassword(string password, string hashedPassword)
        {
            var hashBytes = Convert.FromBase64String(hashedPassword);
            var salt = new byte[SaltSize];
            Array.Copy(hashBytes, 0, salt, 0, SaltSize);

            using (var key = new Rfc2898DeriveBytes(password, salt, Iterations, HashAlgorithmName.SHA256))
            {
                var hash = key.GetBytes(HashSize);
                for (int i = 0; i < HashSize; i++)
                {
                    if (hashBytes[i + SaltSize] != hash[i])
                    {
                        return false;
                    }
                }
            }
            return true;
        }
    }
}