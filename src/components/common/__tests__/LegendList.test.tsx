import { render } from "@testing-library/react-native";

import { LegendList } from "../LegendList";

jest.mock("@legendapp/list/react-native", () => {
  const React = require("react");

  return {
    LegendList: jest.fn((props) => React.createElement("LegendListMock", props)),
  };
});

describe("LegendList wrapper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("applies default recycling and maintain visible position settings", () => {
    const { LegendList: BaseLegendList } = require("@legendapp/list/react-native");

    render(<LegendList data={[{ id: "1" }]} keyExtractor={(item) => item.id} renderItem={() => null} />);

    const props = BaseLegendList.mock.calls[0][0];
    expect(props.recycleItems).toBe(true);
    expect(props.maintainVisibleContentPosition).toBe(true);
  });

  it("allows overriding optimization defaults", () => {
    const { LegendList: BaseLegendList } = require("@legendapp/list/react-native");

    render(
      <LegendList
        data={[{ id: "1" }]}
        keyExtractor={(item) => item.id}
        maintainVisibleContentPosition={false}
        recycleItems={false}
        renderItem={() => null}
      />,
    );

    const props = BaseLegendList.mock.calls[0][0];
    expect(props.recycleItems).toBe(false);
    expect(props.maintainVisibleContentPosition).toBe(false);
  });
});
