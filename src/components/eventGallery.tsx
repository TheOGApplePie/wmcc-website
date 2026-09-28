import "server-only";
import { ClientSecretCredential } from "@azure/identity";
import { Client } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";
import GalleryViewer from "./expandableImage";
import ContentError from "./contentError";

export default async function EventGallery({ url }: Readonly<{ url: string }>) {
  let images: { src: string; alt: string }[];
  try {
    const credential = new ClientSecretCredential(
      process.env.TENANT_ID!,
      process.env.CLIENT_ID!,
      process.env.CLIENT_SECRET!,
    );
    const authProvider = new TokenCredentialAuthenticationProvider(credential, {
      scopes: ["https://graph.microsoft.com/.default"],
    });
    const graph = Client.initWithMiddleware({ authProvider });
    const encoded = "u!" + Buffer.from(url).toString("base64url");
    const result: { value: Record<string, string>[] } = await graph
      .api(`/shares/${encoded}/driveItem/children`)
      .get();
    images = result.value
      .filter((item) => /\.(jpg|jpeg|png)$/i.test(item.name ?? ""))
      .map((item) => ({
        src: item["@microsoft.graph.downloadUrl"],
        alt: item.name || "Gallery image",
      }));
  } catch {
    return (
      <ContentError message="The event gallery is temporarily unavailable." />
    );
  }
  if (!images.length)
    return <p className="p-8">No gallery photos are available yet.</p>;
  return (
    <section className="p-8">
      <h2 className="mb-5">Moments from this event</h2>
      <GalleryViewer images={images} />
    </section>
  );
}
