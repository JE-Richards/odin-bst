function mergeSort(array) {
  if (!Array.isArray(array)) {
    throw new Error('input must be a valid array');
  }

  function splitting(array) {
    if (array.length <= 1) {
      return array;
    }

    let mid = Math.floor(array.length / 2);

    const left = array.slice(0, mid);
    const right = array.slice(mid);

    return [left, right];
  }

  function merging(leftArray, rightArray) {
    let mergedArray = [];
    let i = 0;
    let j = 0;

    while (i < leftArray.length && j < rightArray.length) {
      if (leftArray[i] < rightArray[j]) {
        mergedArray.push(leftArray[i]);
        i += 1;
      } else {
        mergedArray.push(rightArray[j]);
        j += 1;
      }
    }
    // append remaining values
    if (i < leftArray.length) {
      mergedArray = mergedArray.concat(leftArray.slice(i));
    }

    if (j < rightArray.length) {
      mergedArray = mergedArray.concat(rightArray.slice(j));
    }
    return mergedArray;
  }

  // base case
  if (array.length <= 1) {
    return array;
  }

  // recursive cases
  let [leftArray, rightArray] = splitting(array);
  let leftSorted = mergeSort(leftArray);
  let rightSorted = mergeSort(rightArray);

  // output sorted array
  return merging(leftSorted, rightSorted);
}

export { mergeSort };
