import { isProductionHost } from "@/lib/utilities";
import { getRobotsMeta } from "@/lib/seo";
import { headers } from "next/headers";

jest.mock("next/headers", () => ({
  headers: jest.fn(),
}));

const mockHost = (host: string | null, key = "x-forwarded-host") => {
  (headers as jest.Mock).mockResolvedValue({
    get: (name: string) => (name === key ? host : null),
  });
};

describe("isProductionHost", () => {
  it.each([
    ["luxotticaeyecare.luxottica.com", true],
    ["www.luxotticaeyecare.luxottica.com", true],
    ["uat-luxotticaeyecare.luxottica.com", false],
    ["preview-uat-internal-eyecare.luxgroup.net", false],
    ["dev-luxotticaeyecare.luxottica.com", false],
    ["preview-elec.luxgroup.net", false],
    ["localhost:3000", false],
    ["", false],
  ])("returns %s -> %s", (host, expected) => {
    expect(isProductionHost(host)).toBe(expected);
  });
});

describe("getRobotsMeta", () => {
  afterEach(() => jest.clearAllMocks());

  it("allows indexing on the production host", async () => {
    mockHost("luxotticaeyecare.luxottica.com");
    expect(await getRobotsMeta()).toEqual({ index: true, follow: true });
  });

  it("blocks indexing on a uat host", async () => {
    mockHost("uat-luxotticaeyecare.luxottica.com");
    expect(await getRobotsMeta()).toEqual({ index: false, follow: false });
  });

  it("falls back to the host header when x-forwarded-host is absent", async () => {
    mockHost("luxotticaeyecare.luxottica.com", "host");
    expect(await getRobotsMeta()).toEqual({ index: true, follow: true });
  });

  it("blocks indexing when no host header is present", async () => {
    (headers as jest.Mock).mockResolvedValue({ get: () => null });
    expect(await getRobotsMeta()).toEqual({ index: false, follow: false });
  });
});
