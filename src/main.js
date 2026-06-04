// x, y, width, height are in grid units (viewport is 24 cols x 18 rows).
const HOTSPOTS = [
  {
    id: "desk",
    x: 3,
    y: 11,
    width: 5,
    height: 4,
    label: "Detective Desk",
    command: "self.search(desk);",
  },
  {
    id: "cabinet",
    x: 17,
    y: 4,
    width: 4,
    height: 9,
    label: "File Cabinet",
    command: "self.unlock(cabinet);",
  },
  {
    id: "painting",
    x: 10,
    y: 2,
    width: 5,
    height: 4,
    label: "Crooked Painting",
    command: "self.inspect(painting);",
  },
  {
    id: "plant",
    x: 1,
    y: 2,
    width: 3,
    height: 5,
    label: "Potted Fern",
    command: "self.search(plant);",
  },
];

/**
 * Instantiate each hotspot and mount it into the viewport element.
 * @param {Document} doc - defaults to the global document.
 * @returns {Hotspot[]} the created hotspots.
 */
function initViewport(doc = document) {
  const viewport = doc.getElementById("viewport");
  if (!viewport) {
    return [];
  }

  const hotspots = HOTSPOTS.map((spec) => new Hotspot(spec));

  hotspots.forEach((hotspot) => {
    // Tapping a hotspot toggles its hint and closes any other open one,
    // so only a single command is shown at a time.
    hotspot.onSelect = (selected) => {
      hotspots.forEach((other) => {
        if (other !== selected) {
          other.deactivate();
        }
      });
      selected.toggle();
    };
    viewport.append(hotspot.render(doc));
  });

  // Tapping/clicking outside any hotspot dismisses open hints (handy on touch).
  doc.addEventListener("click", (event) => {
    if (!event.target.closest(".hotspot")) {
      hotspots.forEach((hotspot) => hotspot.deactivate());
    }
  });

  return hotspots;
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => initViewport());
}
