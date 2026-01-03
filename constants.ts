
import { ChantPreset, Language } from './types';

export const BEADS_PER_MALA = 108;

export const LANGUAGES: Language[] = [
  { id: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्' },
  { id: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { id: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { id: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { id: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { id: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { id: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { id: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { id: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { id: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' }
];

export const CHANTS_BY_LANGUAGE: Record<string, ChantPreset[]> = {
  sa: [
    { id: 'sa-1', name: 'Om Namah Shivaya', nativeName: 'ॐ नमः शिवाय', color: 'orange' },
    { id: 'sa-r', name: 'Radha', nativeName: 'राधा', color: 'pink' },
    { id: 'sa-k', name: 'Krishna', nativeName: 'कृष्ण', color: 'blue' },
    { id: 'sa-rm', name: 'Ram', nativeName: 'राम', color: 'amber' },
    { id: 'sa-2', name: 'Gayatri Mantra', nativeName: 'गायत्री मन्त्र', color: 'yellow' }
  ],
  hi: [
    { id: 'hi-1', name: 'Jai Shri Ram', nativeName: 'जय श्री राम', color: 'amber' },
    { id: 'hi-r', name: 'Radha', nativeName: 'राधा', color: 'pink' },
    { id: 'hi-k', name: 'Krishna', nativeName: 'कृष्ण', color: 'blue' },
    { id: 'hi-rm', name: 'Ram', nativeName: 'राम', color: 'amber' },
    { id: 'hi-2', name: 'Jai Hanuman', nativeName: 'जय हनुमान', color: 'orange' }
  ],
  pa: [
    { id: 'pa-1', name: 'Waheguru', nativeName: 'ਵਾਹਿਗੁਰੂ', color: 'yellow' },
    { id: 'pa-r', name: 'Radha', nativeName: 'ਰਾਧਾ', color: 'pink' },
    { id: 'pa-k', name: 'Krishna', nativeName: 'ਕ੍ਰਿਸ਼ਨਾ', color: 'blue' },
    { id: 'pa-rm', name: 'Ram', nativeName: 'ਰਾਮ', color: 'amber' },
    { id: 'pa-2', name: 'Ek Onkar', nativeName: 'ਏਕ ਓਂਕਾਰ', color: 'orange' }
  ],
  ta: [
    { id: 'ta-1', name: 'Om Namah Shivaya', nativeName: 'ஓம் நம சிவாய', color: 'orange' },
    { id: 'ta-r', name: 'Radha', nativeName: 'ராதா', color: 'pink' },
    { id: 'ta-k', name: 'Krishna', nativeName: 'கிருஷ்ணா', color: 'blue' },
    { id: 'ta-rm', name: 'Ram', nativeName: 'ராம்', color: 'amber' },
    { id: 'ta-2', name: 'Om Saravana Bhava', nativeName: 'ஓம் சரவண பவ', color: 'amber' }
  ],
  te: [
    { id: 'te-1', name: 'Govinda Govinda', nativeName: 'గోవిందా గోవిందా', color: 'yellow' },
    { id: 'te-r', name: 'Radha', nativeName: 'రాధ', color: 'pink' },
    { id: 'te-k', name: 'Krishna', nativeName: 'కృష్ణ', color: 'blue' },
    { id: 'te-rm', name: 'Ram', nativeName: 'రామ్', color: 'amber' },
    { id: 'te-2', name: 'Om Namo Venkatesaya', nativeName: 'ఓం నమో వేంకటేశాయ', color: 'emerald' }
  ],
  bn: [
    { id: 'bn-1', name: 'Hare Krishna', nativeName: 'হরে কৃষ্ণ', color: 'emerald' },
    { id: 'bn-r', name: 'Radha', nativeName: 'রাধা', color: 'pink' },
    { id: 'bn-k', name: 'Krishna', nativeName: 'কৃষ্ণ', color: 'blue' },
    { id: 'bn-rm', name: 'Ram', nativeName: 'রাম', color: 'amber' },
    { id: 'bn-2', name: 'Joy Maa Durga', nativeName: 'জয় মা দুর্গা', color: 'red' }
  ],
  gu: [
    { id: 'gu-1', name: 'Jai Shri Krishna', nativeName: 'જય શ્રી કૃષ્ણ', color: 'blue' },
    { id: 'gu-r', name: 'Radha', nativeName: 'રાધા', color: 'pink' },
    { id: 'gu-k', name: 'Krishna', nativeName: 'કૃષ્ણ', color: 'blue' },
    { id: 'gu-rm', name: 'Ram', nativeName: 'રામ', color: 'amber' },
    { id: 'gu-2', name: 'Jai Ambey', nativeName: 'જય અંબે', color: 'orange' }
  ],
  mr: [
    { id: 'mr-1', name: 'Vitthal Vitthal', nativeName: 'विठ्ठल विठ्ठल', color: 'blue' },
    { id: 'mr-r', name: 'Radha', nativeName: 'राधा', color: 'pink' },
    { id: 'mr-k', name: 'Krishna', nativeName: 'कृष्ण', color: 'blue' },
    { id: 'mr-rm', name: 'Ram', nativeName: 'राम', color: 'amber' },
    { id: 'mr-2', name: 'Ganpati Bappa Morya', nativeName: 'गणपती बाप्पा मोरया', color: 'orange' }
  ],
  kn: [
    { id: 'kn-1', name: 'Om Namah Shivaya', nativeName: 'ಓಂ ನಮಃ ಶಿವಾಯ', color: 'orange' },
    { id: 'kn-r', name: 'Radha', nativeName: 'ರಾಧಾ', color: 'pink' },
    { id: 'kn-k', name: 'Krishna', nativeName: 'ಕೃಷ್ಣ', color: 'blue' },
    { id: 'kn-rm', name: 'Ram', nativeName: 'ರಾಮ್', color: 'amber' },
    { id: 'kn-2', name: 'Jai Hanuman', nativeName: 'ಜೈ ಹನುಮಾನ್', color: 'amber' }
  ],
  ml: [
    { id: 'ml-1', name: 'Swamiye Saranam Ayyappa', nativeName: 'സ്വാമിയേ ശരണമയ്യപ്പ', color: 'slate' },
    { id: 'ml-r', name: 'Radha', nativeName: 'രാധ', color: 'pink' },
    { id: 'ml-k', name: 'Krishna', nativeName: 'കൃഷ്ണ', color: 'blue' },
    { id: 'ml-rm', name: 'Ram', nativeName: 'രാം', color: 'amber' },
    { id: 'ml-2', name: 'Om Namo Narayanaya', nativeName: 'ഓം നമോ നാരായണായ', color: 'emerald' }
  ]
};

export const STORAGE_KEY = 'ananta_naam_history';
export const STORAGE_SETTINGS_KEY = 'ananta_naam_settings';
