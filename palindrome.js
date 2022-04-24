const checkPalindrome = (string) => {
  // split string to an array
  const splittedText = string.split('');

  // reverse the array values
  const reversedText = splitted.reverse();

  // convert array to string
  const reverseString = reversedText.join('');

  if (string == reverseString) {
    console.log('Palindrome');
  } else {
    console.log('Not Palindrome');
  }
};
