const swapElements = (el1, el2) => {
  el1.classList.toggle('toSwap')
  el2.classList.toggle('toSwap')
    var p2 = el2.parentNode, n2 = el2.nextSibling
    if (n2 === el1) return p2.insertBefore(el1, el2)
    el1.parentNode.insertBefore(el2, el1);
    p2.insertBefore(el1, n2);
}

export default swapElements