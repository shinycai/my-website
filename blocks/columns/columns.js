/**
 * If there is only one sentence in a column, the p tag will not be generated, need to process it manually.
 * @param {*} innerEle
 */
function decorateColumnSentence(innerEle) {
  const tag = innerEle.tagName.toLowerCase();
  const html = `<p>${innerEle.textContent}</p>`;
  if (tag === "div" && innerEle.childNodes.length === 1) {
    innerEle.innerHTML = html;
  }
}

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector("picture");
      if (pic) {
        const picWrapper = pic.closest("div");
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add("columns-img-col");
          picWrapper.parentElement.classList.add("columns-img-col-row");
        }
        /** columns band */
        if (block.className.indexOf("band") > -1) {
          const textWrapperRow = picWrapper.parentElement.nextElementSibling;

          textWrapperRow.classList.add("columns-text-col-row");

          [...textWrapperRow.children].forEach((textCol) => {
            textCol.classList.add("columns-text-col");
            decorateColumnSentence(textCol);
          });
        }
      }
    });
  });
}
