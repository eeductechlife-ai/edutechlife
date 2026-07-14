const VOICE_PROFILES = {
  valeria: {
    languageCode: "es-US",
    name: "es-US-Standard-B",
    pitch: 0,
    speakingRate: 0.95,
    volumeGainDb: 2.5,
  },
  valerio: {
    languageCode: "es-US",
    name: "es-US-Neural2-C",
    pitch: -1.0,
    speakingRate: 0.95,
    volumeGainDb: 3.0,
  },
  sistema: {
    languageCode: "es-US",
    name: "es-US-Neural2-C",
    pitch: 0,
    speakingRate: 1.0,
  },
  nico: {
    languageCode: "es-US",
    name: "es-US-Standard-B",
    pitch: 0,
    speakingRate: 1.0,
  },
  nico_premium: {
    languageCode: "es-US",
    name: "es-US-Neural2-B",
    pitch: 0,
    speakingRate: 1.05,
    volumeGainDb: 3.0,
    effectsProfileId: ["telephony-class-application"],
  },
  nico_authority: {
    languageCode: "es-US",
    name: "es-US-Standard-B",
    pitch: 0,
    speakingRate: 1.05,
    volumeGainDb: 2.5,
  },
  valentina: {
    languageCode: "es-US",
    name: "es-US-Journey-F",
    pitch: 0,
    speakingRate: 0.95,
    volumeGainDb: 2.5,
    effectsProfileId: ["telephony-class-application"],
  },
  valentina_child: {
    languageCode: "es-US",
    name: "es-US-Journey-F",
    pitch: 0,
    speakingRate: 0.85,
    volumeGainDb: 3.0,
    effectsProfileId: ["telephony-class-application"],
  },
  valentina_teen: {
    languageCode: "es-US",
    name: "es-US-Journey-F",
    pitch: 0,
    speakingRate: 1.0,
    volumeGainDb: 2.0,
    effectsProfileId: ["telephony-class-application"],
  },
  dani: {
    languageCode: "es-US",
    name: "es-US-Journey-F",
    pitch: 0,
    speakingRate: 0.9,
    volumeGainDb: 2.5,
    effectsProfileId: ["telephony-class-application"],
  },
};

const VOICE_FALLBACKS = {
  valeria: [
    {
      languageCode: "es-US",
      name: "es-US-Journey-F",
      pitch: 0,
      speakingRate: 0.95,
    },
    {
      languageCode: "es-US",
      name: "es-US-Neural2-C",
      pitch: 0,
      speakingRate: 1.0,
    },
    {
      languageCode: "es-ES",
      name: "es-ES-Neural2-A",
      pitch: 0,
      speakingRate: 0.95,
    },
  ],
  valerio: [
    {
      languageCode: "es-US",
      name: "es-US-Neural2-C",
      pitch: -1.0,
      speakingRate: 0.95,
      volumeGainDb: 3.0,
    },
    {
      languageCode: "es-US",
      name: "es-US-Wavenet-C",
      pitch: -1.5,
      speakingRate: 0.9,
      volumeGainDb: 2.5,
    },
    {
      languageCode: "es-US",
      name: "es-US-Neural2-D",
      pitch: -1.0,
      speakingRate: 0.95,
      volumeGainDb: 2.5,
    },
    {
      languageCode: "es-CO",
      name: "es-CO-Neural2-B",
      pitch: -1.0,
      speakingRate: 0.9,
      volumeGainDb: 2.5,
    },
  ],
  nico: [
    {
      languageCode: "es-US",
      name: "es-US-Neural2-B",
      pitch: 0,
      speakingRate: 1.0,
    },
    {
      languageCode: "es-US",
      name: "es-US-Neural2-A",
      pitch: 0,
      speakingRate: 1.0,
    },
    {
      languageCode: "es-US",
      name: "es-US-Neural2-C",
      pitch: 0,
      speakingRate: 1.0,
    },
    {
      languageCode: "es-ES",
      name: "es-ES-Neural2-B",
      pitch: 0,
      speakingRate: 1.0,
    },
  ],
  nico_premium: [
    {
      languageCode: "es-US",
      name: "es-US-Neural2-B",
      pitch: 0,
      speakingRate: 1.05,
    },
    {
      languageCode: "es-US",
      name: "es-US-Neural2-A",
      pitch: 0,
      speakingRate: 1.05,
    },
    {
      languageCode: "es-US",
      name: "es-US-Neural2-C",
      pitch: 0,
      speakingRate: 1.05,
    },
  ],
  valentina: [
    {
      languageCode: "es-US",
      name: "es-US-Journey-F",
      pitch: 0,
      speakingRate: 0.95,
    },
    {
      languageCode: "es-US",
      name: "es-US-Neural2-C",
      pitch: 0,
      speakingRate: 1.0,
    },
    {
      languageCode: "es-ES",
      name: "es-ES-Neural2-A",
      pitch: 0,
      speakingRate: 0.95,
    },
  ],
  valentina_child: [
    {
      languageCode: "es-US",
      name: "es-US-Journey-F",
      pitch: 0,
      speakingRate: 0.85,
    },
    {
      languageCode: "es-US",
      name: "es-US-Neural2-C",
      pitch: 0,
      speakingRate: 0.9,
    },
    {
      languageCode: "es-ES",
      name: "es-ES-Neural2-A",
      pitch: 0,
      speakingRate: 0.85,
    },
  ],
  valentina_teen: [
    {
      languageCode: "es-US",
      name: "es-US-Journey-F",
      pitch: 0,
      speakingRate: 1.0,
    },
    {
      languageCode: "es-US",
      name: "es-US-Neural2-C",
      pitch: 0,
      speakingRate: 1.1,
    },
    {
      languageCode: "es-ES",
      name: "es-ES-Neural2-A",
      pitch: 0,
      speakingRate: 1.0,
    },
  ],
  dani: [
    {
      languageCode: "es-US",
      name: "es-US-Journey-F",
      pitch: 0,
      speakingRate: 0.9,
    },
    {
      languageCode: "es-US",
      name: "es-US-Neural2-C",
      pitch: 0,
      speakingRate: 0.95,
    },
    {
      languageCode: "es-CO",
      name: "es-CO-Standard-A",
      pitch: 0,
      speakingRate: 0.9,
    },
    {
      languageCode: "es-ES",
      name: "es-ES-Neural2-A",
      pitch: 0,
      speakingRate: 0.9,
    },
  ],
};

export { VOICE_PROFILES, VOICE_FALLBACKS };
