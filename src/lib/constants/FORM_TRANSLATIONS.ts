interface IFormLabels {
  [lang: string]: {
    [type: string]: string;
  };
}

export const FORM_TRANSLATIONS: IFormLabels = {
  ww: {
    Name: "Name",
    Surname: "Surname",
    Countrylist: "Country of residence",
    Email: "Please insert email",
    TopicList: "Topic (please choose from the following)",
    Titlemessage: "Title of your message",
    Message: "Message",
    acknowledge:
      "By sending the form above, I acknowledge that I have read the Privacy Notice and that I have been fully informed of the terms and conditions under which EyeMed Vision Care Europe processes my personal data.",
    button: "SEND MESSAGE",
    buttonsending: "SENDING...",

    textboxplaceholder: "Type here",
    dropdownplaceholder: "Select...",

    "Required field_textboxName": "Name must be at least 2 characters.",
    "Required field_textboxSurname": "Surname must be at least 2 characters.",
    "Required field_textboxEmail": "Please provide a valid email address.",
    "Invalid value_textboxEmail": "Please provide a valid email address.",
    "Required field_selectTopic": "Topic is required",
    "Required field_selectCountry": "Country must be at least 2 characters.",
    "Required field_textboxTitleMessage": "Title of your message must be at least 2 characters.",
    "Required field_textboxMessage": "Message must be at least 10 characters.",
    "Recaptcha error": "Please verify the reCAPTCHA.",
  },
  en: {
    Name: "Name",
    Surname: "Surname",
    Countrylist: "Country of residence",
    Email: "Please insert email",
    TopicList: "Topic (please choose from the following)",
    Titlemessage: "Title of your message",
    Message: "Message",
    acknowledge:
      "By sending the form above, I acknowledge that I have read the Privacy Notice and that I have been fully informed of the terms and conditions under which EyeMed Vision Care Europe processes my personal data.",
    button: "SEND MESSAGE",
    buttonsending: "SENDING...",

    textboxplaceholder: "Type here",
    dropdownplaceholder: "Select...",

    "Required field_textboxName": "Name must be at least 2 characters.",
    "Required field_textboxSurname": "Surname must be at least 2 characters.",
    "Required field_textboxEmail": "Please provide a valid email address.",
    "Invalid value_textboxEmail": "Please provide a valid email address.",
    "Required field_selectTopic": "Topic is required",
    "Required field_selectCountry": "Country must be at least 2 characters.",
    "Required field_textboxTitleMessage": "Title of your message must be at least 2 characters.",
    "Required field_textboxMessage": "Message must be at least 10 characters.",
    "Recaptcha error": "Please verify the reCAPTCHA.",
  },
  de: {
    Name: "Name",
    Surname: "Nachname",
    Countrylist: "Land des Wohnsitzes",
    Email: "Bitte E-Mail einfügen",
    TopicList: "Thema (bitte wählen Sie aus den folgenden)",
    Titlemessage: "Betreff Ihrer Nachricht",
    Message: "Nachricht",
    acknowledge:
      "Durch das Senden des Formulars, erkenne ich an, dass ich die Datenschutzerklärung gelesen habe und dass ich vollständig über die Bedingungen informiert wurde, unter denen EyeMed Vision Care Europe meine persönlichen Daten verarbeitet.",
    button: "Nachricht senden",
    buttonsending: "Nachricht senden",

    textboxplaceholder: "Hier eingeben",
    dropdownplaceholder: "Select...",
 
    "Required field_textboxName": "Der Name muss mindestens 2 Zeichen lang sein.",
    "Required field_textboxSurname": "Der Nachname muss mindestens 2 Zeichen lang sein.",
    "Required field_textboxEmail": "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
    "Invalid value_textboxEmail": "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
    "Required field_selectTopic": "Topic is required",
    "Required field_selectCountry": "Das Land muss mindestens 2 Zeichen lang sein.",
    "Required field_textboxTitleMessage": "Der Titel Ihrer Nachricht muss mindestens 2 Zeichen lang sein.",
    "Required field_textboxMessage": "Die Nachricht muss mindestens 10 Zeichen lang sein.",
    "Recaptcha error": "Bitte überprüfen Sie das reCAPTCHA.",
  },
  it: {
    Name: "Nome",
    Surname: "Cognome",
    Countrylist: "Paese di residenza",
    Email: "Inserisci l'email",
    TopicList: "Argomento (si prega di scegliere tra i seguenti)",
    Titlemessage: "Oggetto del tuo messaggio",
    Message: "Messaggio",
    acknowledge:
      "Inviando il modulo sopra, riconosco di aver letto l'Informativa sulla Privacy e di essere stato pienamente informato delle condizioni con cui EyeMed Vision Care Europe elabora i miei dati personali.",
    button: "Invia Messaggio",
    buttonsending: "Invia Messaggio",

    textboxplaceholder: "Digita qui",
    dropdownplaceholder: "Select...",


    "Required field_textboxName": "Il nome deve essere lungo almeno 2 caratteri.",
    "Required field_textboxSurname": "Il cognome deve essere lungo almeno 2 caratteri.",
    "Required field_textboxEmail": "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
    "Invalid value_textboxEmail": "Fornisci un indirizzo email valido.",
    "Required field_selectTopic": "Topic is required",
    "Required field_selectCountry": "Il Paese deve essere lungo almeno 2 caratteri.",
    "Required field_textboxTitleMessage": "Il titolo del tuo messaggio deve essere lungo almeno 2 caratteri.",
    "Required field_textboxMessage": "Il messaggio deve essere lungo almeno 10 caratteri.",
    "Recaptcha error": "Si prega di verificare il reCAPTCHA.",
  },
};
