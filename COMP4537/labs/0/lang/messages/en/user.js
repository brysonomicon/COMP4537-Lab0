"use strict";

export class Messages {
  static LABEL_HOW_MANY      = "How many buttons to create?";
  static ERROR_INVALID_INPUT = "Please enter a number between 3 and 7.";
  static STATUS_CREATING     = (n) => `Creating ${n} buttons…`;
  static STATUS_SHUFFLE      = "Shuffling...";
  static STATUS_CLICK_NOW    = "Now click the buttons in the original order.";
  static STATUS_EXCELLENT    = "You've got a memory like an elephant!";
  static STATUS_WRONG        = "Wrong order! Maybe next time";
}
