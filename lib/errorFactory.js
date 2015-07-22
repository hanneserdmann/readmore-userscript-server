'use strict'

/**
 * Factory zum erstellen von Fehler-Objekten mit vorgegebenen
 * Typen und entsprechender Beschreibung
 * @constructor
 */
var UserFactory = function () {
    var self = this,
        config  = require('config.json');

    self.getError = function (type) {
        var error = {
            "type":     type,
            "message":  ""
        };

        switch (type) {
        case 'emailNotValid':
            error.message  = 'Die angegebene E-Mail Adresse ist ungültig';
            break;

        case 'passwordLength':
            error.message  = 'Bitte gebe ein Passwort zwischen ' +
                              config.password.minLength + ' und ' +
                              config.password.maxLength + ' Zeichen an';
            break;

        case 'userCreate':
            error.message  = 'Beim anlegen des Benutzers ist ein Fehler aufgetreten. ' +
                             'Bitte versuche es erneut';
            break;

        case 'userLogin':
            error.message  = 'Der Benutzer wurde nicht gefunden oder das Passwort ist inkorrekt';
            break;

        case 'userExists':
            error.message  = 'Es existiert bereits ein User mit der angegebenen Email-Adresse';
            break;

        case 'userNoLogin':
            error.message  = 'Um diese Aktion durchführen zu können musst du angemeldet sein';
            break;

        case 'userNoOption':
            error.message  = 'Es wurden keine Optionen in der Datenbank gefunden';
            break;

        case 'userOptionExists':
            error.message  = 'Es existieren bereits Optionen für diesen User. Für das Editieren bitte HTTP PUT benutzen';
            break;

        case 'userOptionCreate':
            error.message  = 'Beim anlegen der Optionen ist ein Fehler aufgetreten. ' +
                             'Bitte versuche es erneut';
            break;

        case 'userOptionEdit':
            error.message  = 'Beim bearbeiten der Optionen ist ein Fehler aufgetreten. ' +
                             'Bitte versuche es erneut';
            break;

        default:
            error.type     = 'unknown';
            error.message  = 'Es ist ein unbekannter Fehler aufgetreten';
        }

        return error;
    };
};

module.exports = new UserFactory();