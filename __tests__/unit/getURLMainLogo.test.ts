import { getURLMainLogo, IGetURLMainLogoRawData } from "@/lib/utilities";

describe("getURLMainLogo test", () => {
  it("getURLMainLogo to get OS Logo viewtype", () => {
    const mock: IGetURLMainLogoRawData[] = [
      {
        data: {
          uri: "http://preview-stageinteyemed-eu.luxgroup.net/caas/v1/media/6460/data/picture/057be3a4bfae3212e3a2f1ce0b42c567.png",
        },
        viewtype: "OsLogo",
      },
      {
        data: {
          uri: "http://preview-stageinteyemed-eu.luxgroup.net/caas/v1/media/6444/data/picture/77ac3e68c631d53959b7b9b04293fe69.jpg",
        },
        viewtype: "ELLogo",
      },
      {
        data: {
          uri: "http://preview-stageinteyemed-eu.luxgroup.net/caas/v1/media/6444/data/picture/77ac3e68c631d53959b7b9b04293fe69.jpg",
        },
        viewtype: "EMLogo",
      },
    ];

    const result = getURLMainLogo(mock);
    expect(result).not.toBeUndefined();
    expect(result).toEqual(mock.find((item) => item.viewtype === "OsLogo")?.data.uri);
  });
});
