import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, test, expect, vi } from "vitest";
import ChartRenderer from "../ChartRenderer";

// recharts' <ResponsiveContainer> calls `new ResizeObserver(...)`, but jsdom/the
// shared test-setup.ts ResizeObserver mock is not constructable. That's a
// pre-existing test-infra gap unrelated to this refactor, so instead of relying
// on real chart layout (which needs real DOM sizing anyway), we stub the recharts
// primitives ChartRenderer uses and assert on ChartRenderer's own branching logic:
// which chart type renders, and with what data/props.
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  BarChart: ({ children, data }) => (
    <div data-testid="bar-chart" data-points={data.length}>
      {children}
    </div>
  ),
  Bar: ({ children }) => <div data-testid="bar">{children}</div>,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ children, data }) => (
    <div data-testid="pie" data-points={data.length}>
      {children}
    </div>
  ),
  LineChart: ({ children, data }) => (
    <div data-testid="line-chart" data-points={data.length}>
      {children}
    </div>
  ),
  Line: () => <div data-testid="line" />,
  Cell: () => null,
}));

describe("ChartRenderer", () => {
  test("renders nothing when chartData has no data", () => {
    const { container } = render(
      <ChartRenderer chartData={null} darkMode={false} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  test("renders nothing when chartData.data is empty", () => {
    const { container } = render(
      <ChartRenderer chartData={{ type: "bar", data: [] }} darkMode={false} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  test("renders nothing for an unknown chart type", () => {
    const { container } = render(
      <ChartRenderer
        chartData={{ type: "scatter", data: [{ name: "a", value: 1 }] }}
        darkMode={false}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  test("renders a bar chart with the supplied data points", () => {
    const { getByTestId } = render(
      <ChartRenderer
        chartData={{
          type: "bar",
          data: [
            { name: "a", value: 1 },
            { name: "b", value: 2 },
          ],
        }}
        darkMode={false}
      />,
    );
    expect(getByTestId("bar-chart")).toHaveAttribute("data-points", "2");
  });

  test("renders a pie chart with the supplied data points", () => {
    const { getByTestId } = render(
      <ChartRenderer
        chartData={{ type: "pie", data: [{ name: "a", value: 1 }] }}
        darkMode={false}
      />,
    );
    expect(getByTestId("pie")).toHaveAttribute("data-points", "1");
  });

  test("renders a line chart with the supplied data points", () => {
    const { getByTestId } = render(
      <ChartRenderer
        chartData={{ type: "line", data: [{ name: "a", value: 1 }] }}
        darkMode={false}
      />,
    );
    expect(getByTestId("line-chart")).toHaveAttribute("data-points", "1");
  });

  test("applies dark mode styling classes to the chart wrapper", () => {
    const { container } = render(
      <ChartRenderer
        chartData={{ type: "bar", data: [{ name: "a", value: 1 }] }}
        darkMode={true}
      />,
    );
    expect(container.querySelector(".bg-\\[\\#1E293B\\]")).toBeInTheDocument();
  });

  test("applies light mode styling classes to the chart wrapper", () => {
    const { container } = render(
      <ChartRenderer
        chartData={{ type: "bar", data: [{ name: "a", value: 1 }] }}
        darkMode={false}
      />,
    );
    expect(container.querySelector(".bg-white")).toBeInTheDocument();
  });
});
