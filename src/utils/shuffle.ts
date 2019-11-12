/**
 * Shuffles an array of any elements. Uses the Fisher–Yates Shuffle
 * The function doesn't mutate the passed array, instead returns a new one.
 * source: https://bost.ocks.org/mike/shuffle/
 * @param array The array to be shuffled
 */
export const shuffle = (array: Array<any>): Array<any> => {
  const returnArray = [...array];

  let m = returnArray.length;
  let i: number;
  let temp: any;

  while (m) {
    // pick a remaining element
    m -= 1;
    i = Math.floor(Math.random() * m);

    // swap it with the current element
    temp = returnArray[m];
    returnArray[m] = returnArray[i];
    returnArray[i] = temp;
  }

  return returnArray;
};

export default shuffle;
