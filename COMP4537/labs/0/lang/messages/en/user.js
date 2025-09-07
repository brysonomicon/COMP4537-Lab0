export class Messages {
  static HOW_MANY_BUTTONS    = "How many buttons to create?";
  static ERROR_INVALID_INPUT = "Please enter a number between 3 and 7.";
  static STATUS_CREATING     = (n) => `Memorize ${n} in a row`;
  static STATUS_SHUFFLE      = "Shuffling...";
  static STATUS_READY        = "Can you remember the correct order?";
  static STATUS_EXCELLENT    = "You've got a memory like an elephant!";
  static STATUS_WRONG        = "Wrong order! Maybe next time";
  static STATUS_PLAY_AGAIN   = "Play Again?"
}
