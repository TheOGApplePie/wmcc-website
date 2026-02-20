module.exports = {
  images: {
    remotePatterns: [
      new URL("https://gkpctbvyswcfccogoepl.supabase.co/**"),
      new URL("https://picsum.photos/**"),
      new URL("https://institutei3-my.sharepoint.com/**"),
      {
        protocol: "https",
        hostname: "*.sharepoint.com",
      },
    ],
  },
};
