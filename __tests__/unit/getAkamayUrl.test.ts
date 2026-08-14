import { getAkamayUrl } from "@/lib/utilities";
import mock from "@/lib/faker";

describe("getAkamayUrl test", () => {
  it("getAkamayUrl updates hostname", () => {
    const href = mock.faker.internet.url();
    const path = mock.faker.system.filePath();

    const akamaiURL = process.env.AKAMAY_PATH || "AKAMAI MISSING";

    const transformedURL = getAkamayUrl(`${href?.slice(0, href.length - 1)}${path}`);
    expect(transformedURL.match(akamaiURL)?.[0]).toBeDefined();

    const isAkamai = transformedURL.includes(akamaiURL);
    expect(isAkamai).toBeTruthy();    
  });
});
