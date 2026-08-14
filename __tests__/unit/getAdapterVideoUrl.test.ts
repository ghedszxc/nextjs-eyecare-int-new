import { getAdapterVideoUrl, IVideoRawData } from "@/lib/utilities";
import mock from "@/lib/faker";

describe("getAdapterVideoUrl test", () => {
  const mockData: IVideoRawData[] = [
    {
      data: {
        dataUrl: mock.faker.internet.url(),
        uri: mock.faker.internet.url(),
      },
    },
    {
      data: {
        dataUrl: mock.faker.internet.url(),
        uri: mock.faker.internet.url(),
      },
    },
    {
      data: {
        dataUrl: mock.faker.internet.url(),
        uri: mock.faker.internet.url(),
      },
    },
  ];

  it("getAdapterVideoUrl returns expected data", () => {
    const videos = getAdapterVideoUrl(mockData);

    expect(videos.length).toEqual(mockData.length);
    expect(typeof videos[0]).toEqual("string");
    expect(videos.every((video) => typeof video === "string")).toBeTruthy();
  });
});
