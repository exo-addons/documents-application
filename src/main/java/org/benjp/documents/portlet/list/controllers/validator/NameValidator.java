package org.benjp.documents.portlet.list.controllers.validator;

import java.text.StringCharacterIterator;

public class NameValidator {

  /**
   * Ensure names contain only letters, -, and _.
   *
   * @throws IllegalArgumentException if argument does not comply.
   */
  public static void validateName(String aName){
    boolean nameHasContent = (aName != null) && (!aName.equals(""));
    if (!nameHasContent){
      throw new IllegalArgumentException("Name must be non-null and non-empty.");
    }
    StringCharacterIterator iterator = new StringCharacterIterator(aName);
    char character =  iterator.current();
    while (character != StringCharacterIterator.DONE ){
      boolean isValidChar = (Character.isLetter(character)
              || Character.isDigit(character)
              //|| Character.isSpaceChar(character)
              || character =='_'
              || character =='-');
      if ( isValidChar ) {
        //do nothing
      }
      else {
        String message = "Name can contain only letters, digits, dash and underscore characters.";
        throw new IllegalArgumentException(message);
      }
      character = iterator.next();
    }
  }

}
