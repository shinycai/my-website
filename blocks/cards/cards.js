import {
  createOptimizedPicture,
  decorateBrTag,
} from "../../scripts/lib-franklin.js";

function bandCard(li, img) {
  li.setAttribute("style", `background-image: url(${img.src});`);
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement("ul");
  // if (!block.className.indexOf("band") > -1) {
  ul.querySelectorAll("img").forEach((img) =>
    img
      .closest("picture")
      .replaceWith(
        createOptimizedPicture(img.src, img.alt, false, [{ width: "750" }])
      )
  );
  // }

  [...block.children].forEach((row) => {
    const li = document.createElement("li");
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector("picture"))
        div.className = "cards-card-image";
      else div.className = "cards-card-body";

      if (div.className.indexOf("cards-card-body") > -1) {
        [...div.children].forEach((textCol) => {
          textCol.innerHTML = decorateBrTag(textCol.innerHTML);
        });
      }

      if (block.className.indexOf("band") > -1) {
        const _img = li.querySelector("img");
        bandCard(li, _img);
      }

      if (block.className.indexOf("cta-list") > -1) {
      }
    });

    ul.append(li);
  });

  block.textContent = "";
  block.append(ul);
}
