# Mushpup

[![Build Status](https://travis-ci.org/klenwell/mushpup.svg?branch=master)](https://travis-ci.org/klenwell/mushpup)

Passwords obviously are important and most people know by this time how to pick a good one.

For many people, the problem is not so much that their password is weak and too easy
to guess or steal (though this is still a common problem.) The problem is that they
use their same password over and over again -- meaning if it is compromised at any
one of the sites where they use it, it can be misused at another one.

Mushpup is a simple javascript library I've created that leverages existing cryptography
libraries to produce strong, unique passwords that can be securely retrieved from anywhere
there's an internet connection.

## Web Application

The Mushpup web application provides access to an interface to quickly retrieve passwords. It is available over the internet at the following sites:

- http://mushpup.org/
- https://mushpup-demo.appspot.com/


## Installation

Mushpup requires the SHA1 and Base64 algorithms. It currently uses the
[CryptoJS](https://code.google.com/p/crypto-js/) library.

    <script src="http://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/sha1.js"></script>
    <script src="http://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/enc-base64.js"></script>
    <script src="https://rawgit.com/klenwell/mushpup/master/src/mushpup.js"></script>


## Tests
Automated tests can be run using `grunt-cli`:

    cd mushpup
    npm test

To set up grunt on Debian/Ubuntu:

1. Clone the repository

    ```
    git clone git@github.com:klenwell/mushpup.git mushpup
    ```

2. [Install Node.js (with npm)](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager).
3. Install npm packages:

    ```
    npm install grunt-cli
    npm install phantomjs
    ```

4. Install npm package dependencies:

    ```
    cd mushpup
    npm install
    ```

You should be good to test.


## Usage

A Mushpup hash is a 24-character string of characters from which a user may reliably retrieve
a site-specific password, based on a master password only she knows and a simple routine.

### Developers
To generate a Mushpup hash using the Mushpup library:

    var locus = $('input#locus').val().trim();
    var pocus = $('input#pocus').val().trim();
    var mushpup = Mushpup.mush(locus, pocus);

### Users
To start using Mushpup as a user, you need to do the following three things:

1. Pick a Mushpup secret word (a master password only you remember)
2. Pick a Mushpup number (between 8 and 16)
3. Pick a side (left, right, or middle)

Then, whenever you need a password for a new site, follow this routine:

1. Identify new site (e.g. github.com)
2. Set your user name (e.g. klenwell)
3. Set your locus value based form site/user (e.g. github.com/klenwell)

Finally, to retrive the password:

1. Input locus and Mushpup secret word in the Mushpup form.
2. Using Mushpup number and Mushpup side, copy your password
3. Paste it into the site login password field.

### Mnemonics
Never write your password down. Use mnemonics. If you want to record your Mushpup secret word,
email yourself a hint. For example, if your secret word is SmithJenna23 and you use the middle
12 characters, you could use a clue like this:

- MaidenYoungestsis#MJ#-m12

Use the following form for your individual Mushpup site passwords:

- m{ github.com/klenwell }m12

This tells you that the locus is `github.com/klenwell` and your password will be the middle
12 characters of the resulting hash.

However, you can be even safer if you use your regular Mushpup number and side:

- m{github}

Or, to remind yourself you used mushpup for your password, simply:

- m{}
