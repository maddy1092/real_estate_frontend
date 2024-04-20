const allCountries = [
  {
    name: "Afghanistan",
    country_code: "af",
    dial_code: "+93"
  },
  {
    name: "Albania",
    country_code: "al",
    dial_code: "+355"
  },
  {
    name: "Algeria",
    country_code: "dz",
    dial_code: "+213"
  },
  {
    name: "American Samoa",
    country_code: "as",
    dial_code: "+1684"
  },
  {
    name: "Andorra",
    country_code: "ad",
    dial_code: "+376"
  },
  {
    name: "Angola",
    country_code: "ao",
    dial_code: "+244"
  },
  {
    name: "Anguilla",
    country_code: "ai",
    dial_code: "+1264"
  },
  {
    name: "Antigua and Barbuda",
    country_code: "ag",
    dial_code: "+1268"
  },
  {
    name: "Argentina",
    country_code: "ar",
    dial_code: "+54"
  },
  {
    name: "Armenia",
    country_code: "am",
    dial_code: "+374"
  },
  {
    name: "Aruba",
    country_code: "aw",
    dial_code: "+297"
  },
  {
    name: "Australia",
    country_code: "au",
    dial_code: "+61"
  },
  {
    name: "Austria",
    country_code: "at",
    dial_code: "+43"
  },
  {
    name: "Azerbaijan",
    country_code: "az",
    dial_code: "+994"
  },
  {
    name: "Bahamas",
    country_code: "bs",
    dial_code: "+1242"
  },
  {
    name: "Bahrain",
    country_code: "bh",
    dial_code: "+973"
  },
  {
    name: "Bangladesh",
    country_code: "bd",
    dial_code: "+880"
  },
  {
    name: "Barbados",
    country_code: "bb",
    dial_code: "+1246"
  },
  {
    name: "Belarus",
    country_code: "by",
    dial_code: "+375"
  },
  {
    name: "Belgium",
    country_code: "be",
    dial_code: "+32"
  },
  {
    name: "Belize",
    country_code: "bz",
    dial_code: "+501"
  },
  {
    name: "Benin",
    country_code: "bj",
    dial_code: "+229"
  },
  {
    name: "Bermuda",
    country_code: "bm",
    dial_code: "+1441"
  },
  {
    name: "Bhutan",
    country_code: "bt",
    dial_code: "+975"
  },
  {
    name: "Bolivia",
    country_code: "bo",
    dial_code: "+591"
  },
  {
    name: "Bosnia and Herzegovina",
    country_code: "ba",
    dial_code: "+387"
  },
  {
    name: "Botswana",
    country_code: "bw",
    dial_code: "+267"
  },
  {
    name: "Brazil",
    country_code: "br",
    dial_code: "+55"
  },
  {
    name: "British Indian Ocean Territory",
    country_code: "io",
    dial_code: "+246"
  },
  {
    name: "British Virgin Islands",
    country_code: "vg",
    dial_code: "+1284"
  },
  {
    name: "Brunei",
    country_code: "bn",
    dial_code: "+673"
  },
  {
    name: "Bulgaria",
    country_code: "bg",
    dial_code: "+359"
  },
  {
    name: "Burkina Faso",
    country_code: "bf",
    dial_code: "+226"
  },
  {
    name: "Burundi",
    country_code: "bi",
    dial_code: "+257"
  },
  {
    name: "Cambodia",
    country_code: "kh",
    dial_code: "+855"
  },
  {
    name: "Cameroon",
    country_code: "cm",
    dial_code: "+237"
  },
  {
    name: "Canada",
    country_code: "ca",
    dial_code: "+1"
  },
  {
    name: "Cape Verde",
    country_code: "cv",
    dial_code: "+238"
  },
  {
    name: "Caribbean Netherlands",
    country_code: "bq",
    dial_code: "+599"
  },
  {
    name: "Cayman Islands",
    country_code: "ky",
    dial_code: "+1345"
  },
  {
    name: "Central African Republic",
    country_code: "cf",
    dial_code: "+236"
  },
  {
    name: "Chad",
    country_code: "td",
    dial_code: "+235"
  },
  {
    name: "Chile",
    country_code: "cl",
    dial_code: "+56"
  },
  {
    name: "China",
    country_code: "cn",
    dial_code: "+86"
  },
  {
    name: "Christmas Island",
    country_code: "cx",
    dial_code: "+61"
  },
  {
    name: "Cocos (Keeling) Islands",
    country_code: "cc",
    dial_code: "+61"
  },
  {
    name: "Colombia",
    country_code: "co",
    dial_code: "+57"
  },
  {
    name: "Comoros",
    country_code: "km",
    dial_code: "+269"
  },
  {
    name: "Congo",
    country_code: "cd",
    dial_code: "+243"
  },
  {
    name: "Congo (Republic) (Congo-Brazzaville)",
    country_code: "cg",
    dial_code: "+242"
  },
  {
    name: "Cook Islands",
    country_code: "ck",
    dial_code: "+682"
  },
  {
    name: "Costa Rica",
    country_code: "cr",
    dial_code: "+506"
  },
  {
    name: "Côte d’Ivoire",
    country_code: "ci",
    dial_code: "+225"
  },
  {
    name: "Croatia",
    country_code: "hr",
    dial_code: "+385"
  },
  {
    name: "Cuba",
    country_code: "cu",
    dial_code: "+53"
  },
  {
    name: "Curaçao",
    country_code: "cw",
    dial_code: "+599"
  },
  {
    name: "Cyprus",
    country_code: "cy",
    dial_code: "+357"
  },
  {
    name: "Czech Republic",
    country_code: "cz",
    dial_code: "+420"
  },
  {
    name: "Denmark",
    country_code: "dk",
    dial_code: "+45"
  },
  {
    name: "Djibouti",
    country_code: "dj",
    dial_code: "+253"
  },
  {
    name: "Dominica",
    country_code: "dm",
    dial_code: "+1767"
  },
  {
    name: "Dominican Republic",
    country_code: "do",
    dial_code: "+1"
  },
  {
    name: "Ecuador",
    country_code: "ec",
    dial_code: "+593"
  },
  {
    name: "Egypt",
    country_code: "eg",
    dial_code: "+20"
  },
  {
    name: "El Salvador",
    country_code: "sv",
    dial_code: "+503"
  },
  {
    name: "Equatorial Guinea",
    country_code: "gq",
    dial_code: "+240"
  },
  {
    name: "Eritrea",
    country_code: "er",
    dial_code: "+291"
  },
  {
    name: "Estonia",
    country_code: "ee",
    dial_code: "+372"
  },
  {
    name: "Ethiopia",
    country_code: "et",
    dial_code: "+251"
  },
  {
    name: "Falkland Islands (Malvinas)",
    country_code: "fk",
    dial_code: "+500"
  },
  {
    name: "Faroe Islands",
    country_code: "fo",
    dial_code: "+298"
  },
  {
    name: "Fiji",
    country_code: "fj",
    dial_code: "+679"
  },
  {
    name: "Finland",
    country_code: "fi",
    dial_code: "+358"
  },
  {
    name: "France",
    country_code: "fr",
    dial_code: "+33"
  },
  {
    name: "French Guiana",
    country_code: "gf",
    dial_code: "+594"
  },
  {
    name: "French Polynesia",
    country_code: "pf",
    dial_code: "+689"
  },
  {
    name: "Gabon",
    country_code: "ga",
    dial_code: "+241"
  },
  {
    name: "Gambia",
    country_code: "gm",
    dial_code: "+220"
  },
  {
    name: "Georgia",
    country_code: "ge",
    dial_code: "+995"
  },
  {
    name: "Germany",
    country_code: "de",
    dial_code: "+49"
  },
  {
    name: "Ghana",
    country_code: "gh",
    dial_code: "+233"
  },
  {
    name: "Gibraltar",
    country_code: "gi",
    dial_code: "+350"
  },
  {
    name: "Greece",
    country_code: "gr",
    dial_code: "+30"
  },
  {
    name: "Greenland",
    country_code: "gl",
    dial_code: "+299"
  },
  {
    name: "Grenada",
    country_code: "gd",
    dial_code: "+1473"
  },
  {
    name: "Guadeloupe",
    country_code: "gp",
    dial_code: "+590"
  },
  {
    name: "Guam",
    country_code: "gu",
    dial_code: "+1671"
  },
  {
    name: "Guatemala",
    country_code: "gt",
    dial_code: "+502"
  },
  {
    name: "Guernsey",
    country_code: "gg",
    dial_code: "+44"
  },
  {
    name: "Guinea",
    country_code: "gn",
    dial_code: "+224"
  },
  {
    name: "Guinea-Bissau",
    country_code: "gw",
    dial_code: "+245"
  },
  {
    name: "Guyana",
    country_code: "gy",
    dial_code: "+592"
  },
  {
    name: "Haiti",
    country_code: "ht",
    dial_code: "+509"
  },
  {
    name: "Honduras",
    country_code: "hn",
    dial_code: "+504"
  },
  {
    name: "Hong Kong",
    country_code: "hk",
    dial_code: "+852"
  },
  {
    name: "Hungary",
    country_code: "hu",
    dial_code: "+36"
  },
  {
    name: "Iceland",
    country_code: "is",
    dial_code: "+354"
  },
  {
    name: "India",
    country_code: "in",
    dial_code: "+91"
  },
  {
    name: "Indonesia",
    country_code: "id",
    dial_code: "+62"
  },
  {
    name: "Iran",
    country_code: "ir",
    dial_code: "+98"
  },
  {
    name: "Iraq",
    country_code: "iq",
    dial_code: "+964"
  },
  {
    name: "Ireland",
    country_code: "ie",
    dial_code: "+353"
  },
  {
    name: "Isle of Man",
    country_code: "im",
    dial_code: "+44"
  },
  {
    name: "Israel",
    country_code: "il",
    dial_code: "+972"
  },
  {
    name: "Italy",
    country_code: "it",
    dial_code: "+39"
  },
  {
    name: "Jamaica",
    country_code: "jm",
    dial_code: "+1876"
  },
  {
    name: "Japan",
    country_code: "jp",
    dial_code: "+81"
  },
  {
    name: "Jersey",
    country_code: "je",
    dial_code: "+44"
  },
  {
    name: "Jordan",
    country_code: "jo",
    dial_code: "+962"
  },
  {
    name: "Kazakhstan",
    country_code: "kz",
    dial_code: "+7"
  },
  {
    name: "Kenya",
    country_code: "ke",
    dial_code: "+254"
  },
  {
    name: "Kiribati",
    country_code: "ki",
    dial_code: "+686"
  },
  {
    name: "Kosovo",
    country_code: "xk",
    dial_code: "+383"
  },
  {
    name: "Kuwait",
    country_code: "kw",
    dial_code: "+965"
  },
  {
    name: "Kyrgyzstan",
    country_code: "kg",
    dial_code: "+996"
  },
  {
    name: "Laos",
    country_code: "la",
    dial_code: "+856"
  },
  {
    name: "Latvia",
    country_code: "lv",
    dial_code: "+371"
  },
  {
    name: "Lebanon",
    country_code: "lb",
    dial_code: "+961"
  },
  {
    name: "Lesotho",
    country_code: "ls",
    dial_code: "+266"
  },
  {
    name: "Liberia",
    country_code: "lr",
    dial_code: "+231"
  },
  {
    name: "Libya",
    country_code: "ly",
    dial_code: "+218"
  },
  {
    name: "Liechtenstein",
    country_code: "li",
    dial_code: "+423"
  },
  {
    name: "Lithuania",
    country_code: "lt",
    dial_code: "+370"
  },
  {
    name: "Luxembourg",
    country_code: "lu",
    dial_code: "+352"
  },
  {
    name: "Macau",
    country_code: "mo",
    dial_code: "+853"
  },
  {
    name: "Macedonia (FYROM)",
    country_code: "mk",
    dial_code: "+389"
  },
  {
    name: "Madagascar",
    country_code: "mg",
    dial_code: "+261"
  },
  {
    name: "Malawi",
    country_code: "mw",
    dial_code: "+265"
  },
  {
    name: "Malaysia",
    country_code: "my",
    dial_code: "+60"
  },
  {
    name: "Maldives",
    country_code: "mv",
    dial_code: "+960"
  },
  {
    name: "Mali",
    country_code: "ml",
    dial_code: "+223"
  },
  {
    name: "Malta",
    country_code: "mt",
    dial_code: "+356"
  },
  {
    name: "Marshall Islands",
    country_code: "mh",
    dial_code: "+692"
  },
  {
    name: "Martinique",
    country_code: "mq",
    dial_code: "+596"
  },
  {
    name: "Mauritania",
    country_code: "mr",
    dial_code: "+222"
  },
  {
    name: "Mauritius",
    country_code: "mu",
    dial_code: "+230"
  },
  {
    name: "Mayotte",
    country_code: "yt",
    dial_code: "+262"
  },
  {
    name: "Mexico",
    country_code: "mx",
    dial_code: "+52"
  },
  {
    name: "Micronesia",
    country_code: "fm",
    dial_code: "+691"
  },
  {
    name: "Moldova (Republica Moldova)",
    country_code: "md",
    dial_code: "+373"
  },
  {
    name: "Monaco",
    country_code: "mc",
    dial_code: "+377"
  },
  {
    name: "Mongolia",
    country_code: "mn",
    dial_code: "+976"
  },
  {
    name: "Montenegro",
    country_code: "me",
    dial_code: "+382"
  },
  {
    name: "Montserrat",
    country_code: "ms",
    dial_code: "+1664"
  },
  {
    name: "Morocco",
    country_code: "ma",
    dial_code: "+212"
  },
  {
    name: "Mozambique",
    country_code: "mz",
    dial_code: "+258"
  },
  {
    name: "Myanmar",
    country_code: "mm",
    dial_code: "+95"
  },
  {
    name: "Namibia",
    country_code: "na",
    dial_code: "+264"
  },
  {
    name: "Nauru",
    country_code: "nr",
    dial_code: "+674"
  },
  {
    name: "Nepal",
    country_code: "np",
    dial_code: "+977"
  },
  {
    name: "Netherlands",
    country_code: "nl",
    dial_code: "+31"
  },
  {
    name: "New Caledonia",
    country_code: "nc",
    dial_code: "+687"
  },
  {
    name: "New Zealand",
    country_code: "nz",
    dial_code: "+64"
  },
  {
    name: "Nicaragua",
    country_code: "ni",
    dial_code: "+505"
  },
  {
    name: "Niger",
    country_code: "ne",
    dial_code: "+227"
  },
  {
    name: "Nigeria",
    country_code: "ng",
    dial_code: "+234"
  },
  {
    name: "Niue",
    country_code: "nu",
    dial_code: "+683"
  },
  {
    name: "Norfolk Island",
    country_code: "nf",
    dial_code: "+672"
  },
  {
    name: "North Korea",
    country_code: "kp",
    dial_code: "+850"
  },
  {
    name: "Northern Mariana Islands",
    country_code: "mp",
    dial_code: "+1670"
  },
  {
    name: "Norway",
    country_code: "no",
    dial_code: "+47"
  },
  {
    name: "Oman",
    country_code: "om",
    dial_code: "+968"
  },
  {
    name: "Pakistan",
    country_code: "pk",
    dial_code: "+92"
  },
  {
    name: "Palau",
    country_code: "pw",
    dial_code: "+680"
  },
  {
    name: "Palestine",
    country_code: "ps",
    dial_code: "+970"
  },
  {
    name: "Panama",
    country_code: "pa",
    dial_code: "+507"
  },
  {
    name: "Papua New Guinea",
    country_code: "pg",
    dial_code: "+675"
  },
  {
    name: "Paraguay",
    country_code: "py",
    dial_code: "+595"
  },
  {
    name: "Peru",
    country_code: "pe",
    dial_code: "+51"
  },
  {
    name: "Philippines",
    country_code: "ph",
    dial_code: "+63"
  },
  {
    name: "Poland",
    country_code: "pl",
    dial_code: "+48"
  },
  {
    name: "Portugal",
    country_code: "pt",
    dial_code: "+351"
  },
  {
    name: "Puerto Rico",
    country_code: "pr",
    dial_code: "+1"
  },
  {
    name: "Qatar",
    country_code: "qa",
    dial_code: "+974"
  },
  {
    name: "Réunion",
    country_code: "re",
    dial_code: "+262"
  },
  {
    name: "Romania",
    country_code: "ro",
    dial_code: "+40"
  },
  {
    name: "Russia",
    country_code: "ru",
    dial_code: "+7"
  },
  {
    name: "Rwanda",
    country_code: "rw",
    dial_code: "+250"
  },
  {
    name: "Saint Barthélemy",
    country_code: "bl",
    dial_code: "+590"
  },
  {
    name: "Saint Helena",
    country_code: "sh",
    dial_code: "+290"
  },
  {
    name: "Saint Kitts and Nevis",
    country_code: "kn",
    dial_code: "+1869"
  },
  {
    name: "Saint Lucia",
    country_code: "lc",
    dial_code: "+1758"
  },
  {
    name: "Saint Martin (French part)",
    country_code: "mf",
    dial_code: "+590"
  },
  {
    name: "Saint Pierre and Miquelon",
    country_code: "pm",
    dial_code: "+508"
  },
  {
    name: "Saint Vincent and the Grenadines",
    country_code: "vc",
    dial_code: "+1784"
  },
  {
    name: "Samoa",
    country_code: "ws",
    dial_code: "+685"
  },
  {
    name: "San Marino",
    country_code: "sm",
    dial_code: "+378"
  },
  {
    name: "Sao Tome and Principe",
    country_code: "st",
    dial_code: "+239"
  },
  {
    name: "Saudi Arabia",
    country_code: "sa",
    dial_code: "+966"
  },
  {
    name: "Senegal",
    country_code: "sn",
    dial_code: "+221"
  },
  {
    name: "Serbia",
    country_code: "rs",
    dial_code: "+381"
  },
  {
    name: "Seychelles",
    country_code: "sc",
    dial_code: "+248"
  },
  {
    name: "Sierra Leone",
    country_code: "sl",
    dial_code: "+232"
  },
  {
    name: "Singapore",
    country_code: "sg",
    dial_code: "+65"
  },
  {
    name: "Sint Maarten",
    country_code: "sx",
    dial_code: "+1721"
  },
  {
    name: "Slovakia",
    country_code: "sk",
    dial_code: "+421"
  },
  {
    name: "Slovenia",
    country_code: "si",
    dial_code: "+386"
  },
  {
    name: "Solomon Islands",
    country_code: "sb",
    dial_code: "+677"
  },
  {
    name: "Somalia",
    country_code: "so",
    dial_code: "+252"
  },
  {
    name: "South Africa",
    country_code: "za",
    dial_code: "+27"
  },
  {
    name: "South Korea",
    country_code: "kr",
    dial_code: "+82"
  },
  {
    name: "South Sudan",
    country_code: "ss",
    dial_code: "+211"
  },
  {
    name: "Spain",
    country_code: "es",
    dial_code: "+34"
  },
  {
    name: "Sri Lanka",
    country_code: "lk",
    dial_code: "+94"
  },
  {
    name: "Sudan",
    country_code: "sd",
    dial_code: "+249"
  },
  {
    name: "Suriname",
    country_code: "sr",
    dial_code: "+597"
  },
  {
    name: "Svalbard and Jan Mayen",
    country_code: "sj",
    dial_code: "+47"
  },
  {
    name: "Swaziland",
    country_code: "sz",
    dial_code: "+268"
  },
  {
    name: "Sweden",
    country_code: "se",
    dial_code: "+46"
  },
  {
    name: "Switzerland",
    country_code: "ch",
    dial_code: "+41"
  },
  {
    name: "Syria",
    country_code: "sy",
    dial_code: "+963"
  },
  {
    name: "Taiwan",
    country_code: "tw",
    dial_code: "+886"
  },
  {
    name: "Tajikistan",
    country_code: "tj",
    dial_code: "+992"
  },
  {
    name: "Tanzania",
    country_code: "tz",
    dial_code: "+255"
  },
  {
    name: "Thailand",
    country_code: "th",
    dial_code: "+66"
  },
  {
    name: "Timor-Leste",
    country_code: "tl",
    dial_code: "+670"
  },
  {
    name: "Togo",
    country_code: "tg",
    dial_code: "+228"
  },
  {
    name: "Tokelau",
    country_code: "tk",
    dial_code: "+690"
  },
  {
    name: "Tonga",
    country_code: "to",
    dial_code: "+676"
  },
  {
    name: "Trinidad and Tobago",
    country_code: "tt",
    dial_code: "+1868"
  },
  {
    name: "Tunisia",
    country_code: "tn",
    dial_code: "+216"
  },
  {
    name: "Turkey",
    country_code: "tr",
    dial_code: "+90"
  },
  {
    name: "Turkmenistan",
    country_code: "tm",
    dial_code: "+993"
  },
  {
    name: "Turks and Caicos Islands",
    country_code: "tc",
    dial_code: "+1649"
  },
  {
    name: "Tuvalu",
    country_code: "tv",
    dial_code: "+688"
  },
  {
    name: "U.S. Virgin Islands",
    country_code: "vi",
    dial_code: "+1340"
  },
  {
    name: "Uganda",
    country_code: "ug",
    dial_code: "+256"
  },
  {
    name: "Ukraine",
    country_code: "ua",
    dial_code: "+380"
  },
  {
    name: "United Arab Emirates",
    country_code: "ae",
    dial_code: "+971"
  },
  {
    name: "United Kingdom",
    country_code: "gb",
    dial_code: "+44"
  },
  {
    name: "United States",
    country_code: "us",
    dial_code: "+1"
  },
  {
    name: "Uruguay",
    country_code: "uy",
    dial_code: "+598"
  },
  {
    name: "Uzbekistan",
    country_code: "uz",
    dial_code: "+998"
  },
  {
    name: "Vanuatu",
    country_code: "vu",
    dial_code: "+678"
  },
  {
    name: "Vatican City",
    country_code: "va",
    dial_code: "+39"
  },
  {
    name: "Venezuela",
    country_code: "ve",
    dial_code: "+58"
  },
  {
    name: "Vietnam",
    country_code: "vn",
    dial_code: "+84"
  },
  {
    name: "Wallis and Futuna",
    country_code: "wf",
    dial_code: "+681"
  },
  {
    name: "Western Sahara",
    country_code: "eh",
    dial_code: "+212"
  },
  {
    name: "Yemen",
    country_code: "ye",
    dial_code: "+967"
  },
  {
    name: "Zambia",
    country_code: "zm",
    dial_code: "+260"
  },
  {
    name: "Zimbabwe",
    country_code: "zw",
    dial_code: "+263"
  },
  {
    name: "Åland Islands",
    country_code: "ax",
    dial_code: "+358"
  }
];

export default allCountries;
