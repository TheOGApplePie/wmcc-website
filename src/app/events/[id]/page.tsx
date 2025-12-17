import { fetchOneEvent } from "../../../actions/events";
import { ClientSecretCredential } from "@azure/identity";
import { Client } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";
export default async function EventDetails({
  params,
}: {
  params: { id: number };
}) {
  const event = (await fetchOneEvent(params)).data?.data[0];

  const credential = new ClientSecretCredential(
    process.env.TENANT_ID!,
    process.env.CLIENT_ID!,
    process.env.CLIENT_SECRET!
  );

  const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: ["https://graph.microsoft.com/.default"],
  });
  const shareUrl = event?.gallery_url;
  const encodedUrl = encodeSharingUrl(shareUrl);
  const graphClient = Client.initWithMiddleware({ authProvider: authProvider });
  let driveItem = await graphClient
    .api(`/shares/${encodedUrl}/driveItem/children`)
    .get();
  console.log(driveItem);
  return event ? (
    <div>
      <div>
        {event.poster_url && (
          <div>
            <img src={event.poster_url} alt={event.poster_alt} />
          </div>
        )}
        <div>
          <h1>{event.title}</h1>
          <p>{event.description}</p>
        </div>
      </div>
      <div></div>
    </div>
  ) : (
    <></>
  );
}
function encodeSharingUrl(url: string) {
  return (
    "u!" +
    Buffer.from(url)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "")
  );
}
