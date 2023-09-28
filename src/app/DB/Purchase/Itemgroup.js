"use client";
const Itemgroup = [
  { value: "ABC" },
  { value: "ACTIVE GOLD" },
  { value: "ADHESIVE" },
  { value: "ADICO" },
  { value: "ADITYA" },
  { value: "AIR" },
  { value: "ALASKA" },
  { value: "ALLIED" },
  { value: "ALPOIL" },
  { value: "AMFIL" },
  { value: "AMW" },
  { value: "ANABOND" },
  { value: "ANUPAM" },
  { value: "APLS" },
  { value: "ARB" },
  { value: "ASK" },
  { value: "ASPA" },
  { value: "ASTRAL" },
  { value: "ATUL" },
  { value: "AUTL" },
  { value: "AUTOCOMP" },
  { value: "AUTOLEK" },
  { value: "AUTOPAL" },
  { value: "AYUB" },
  { value: "BANCO" },
  { value: "BGL" },
  { value: "BHARAT" },
  { value: "BHARATBNEZ" },
  { value: "BIMITE" },
  { value: "BINTAX" },
  { value: "BOSCH" },
  { value: "BRAKES INDIA" },
  { value: "BRAKES INDIA LTD" },
  { value: "CA" },
  { value: "CALEX" },
  { value: "CAMPA" },
  { value: "CAROT" },
  { value: "CASTROL" },
  { value: "CEEKAY" },
  { value: "CHILLER ITEM" },
  { value: "CLAMP ITEM" },
  { value: "CMX" },
  { value: "COMPO" },
  { value: "CONE" },
  { value: "CONTINENTAL" },
  { value: "COSMIC" },
  { value: "CUMMINS" },
  { value: "DAICO" },
  { value: "DD" },
  { value: "DEC" },
  { value: "DELITE" },
  { value: "DELUX" },
  { value: "DEMM" },
  { value: "DEVENDRA" },
  { value: "DONALDSON" },
  { value: "DYNASEAL" },
  { value: "EATON" },
  { value: "EICHER" },
  { value: "ELCHICO" },
  { value: "ELECTRICAL" },
  { value: "ELF" },
  { value: "ELOFIC" },
  { value: "EMERY" },
  { value: "ENG ITEMS" },
  { value: "EVEREST" },
  { value: "EVL" },
  { value: "EXIDE" },
  { value: "FAG" },
  { value: "FATAFAT" },
  { value: "FENNER" },
  { value: "FERODO" },
  { value: "FG" },
  { value: "FILTRUM" },
  { value: "FINOLEX" },
  { value: "FLEXO" },
  { value: "FUSI" },
  { value: "GATES" },
  { value: "GABRIEL" },
  { value: "GAJARA" },
  { value: "GASKET" },
  { value: "GEAR BOX GB30" },
  { value: "GEAR BOX GB40 ITEM" },
  { value: "GEAR ITEM" },
  { value: "General" },
  { value: "GENTLEMAN" },
  { value: "GIBRALTOR" },
  { value: "GOETZ" },
  { value: "GOGO" },
  { value: "GRR" },
  { value: "GS" },
  { value: "GULF" },
  { value: "HARISH" },
  { value: "HELLA" },
  { value: "HISPIN" },
  { value: "HP" },
  { value: "HS" },
  { value: "INSURANCE" },
  { value: "IPL" },
  { value: "JAGAN" },
  { value: "JAI" },
  { value: "JAY" },
  { value: "JAYCO" },
  { value: "JNM" },
  { value: "KAFILA" },
  { value: "KAMCO" },
  { value: "KBX" },
  { value: "KCI" },
  { value: "KD" },
  { value: "KGN" },
  { value: "KIRLOSKAR" },
  { value: "KKI" },
  { value: "KNORR BREMSE" },
  { value: "KROSS" },
  { value: "LAMINA" },
  { value: "LEYPARTS" },
  { value: "LFAF" },
  { value: "LIPE" },
  { value: "LISPART" },
  { value: "LUBRICANTS" },
  { value: "LUCAS" },
  { value: "LUK" },
  { value: "LUMAN" },
  { value: "LUMAX" },
  { value: "MAHINDRA" },
  { value: "MAK" },
  { value: "MANN" },
  { value: "MARCOPOLO" },
  { value: "MARX" },
  { value: "MAXMOL" },
  { value: "MBL" },
  { value: "MEI" },
  { value: "MENON" },
  { value: "MERITOR" },
  { value: "MFC" },
  { value: "MICO" },
  { value: "MICO LUBES" },
  { value: "MICRO LINE" },
  { value: "MILES" },
  { value: "MILLARD" },
  { value: "MINDA" },
  { value: "MNR" },
  { value: "MOBIL" },
  { value: "MORPAR" },
  { value: "MOTHER SON" },
  { value: "MSL" },
  { value: "MTL" },
  { value: "NBC" },
  { value: "NEOLITE" },
  { value: "NICE" },
  { value: "NIKKO" },
  { value: "NRB" },
  { value: "NUTBOLT" },
  { value: "NUTEK" },
  { value: "NYEON" },
  { value: "OAYKAY" },
  { value: "ORBIT" },
  { value: "PARKASH" },
  { value: "PARTSMART" },
  { value: "PBG" },
  { value: "PC" },
  { value: "Pcs" },
  { value: "PENSOL" },
  { value: "PENTA" },
  { value: "PHILIPS" },
  { value: "PIONEER" },
  { value: "PIPE ITEM" },
  { value: "PIX" },
  { value: "PKG ITEMS" },
  { value: "PRABHU" },
  { value: "PRICOL" },
  { value: "PRIZOL" },
  { value: "PROLIFE" },
  { value: "PROPSHAFT" },
  { value: "PUROLATOR" },
  { value: "RADHE" },
  { value: "RANBRO" },
  { value: "RANE" },
  { value: "RANE CLUTCH" },
  { value: "RANE CROSS" },
  { value: "RANE ENG" },
  { value: "RANE TRW" },
  { value: "RBL" },
  { value: "RIDER" },
  { value: "RIVON" },
  { value: "RKI" },
  { value: "RMP" },
  { value: "ROOTS" },
  { value: "RSB" },
  { value: "SADHU" },
  { value: "SAMRAT" },
  { value: "SERVO" },
  { value: "Set" },
  { value: "SKF" },
  { value: "SMB" },
  { value: "SOCKET" },
  { value: "SONICO" },
  { value: "SONNET" },
  { value: "SORL" },
  { value: "SPANNER" },
  { value: "SPG" },
  { value: "SPICER" },
  { value: "SRMT" },
  { value: "STL" },
  { value: "SUKUN" },
  { value: "SUNNY" },
  { value: "SUPER SEAL" },
  { value: "SUPER TARUS" },
  { value: "SVL" },
  { value: "SWATI GOLD" },
  { value: "TALBROS" },
  { value: "TANATAN" },
  { value: "TAPARIA" },
  { value: "TBC" },
  { value: "TEXSPIN" },
  { value: "TGP" },
  { value: "TGP LUBE" },
  { value: "TIGER POWER" },
  { value: "TIMKEN" },
  { value: "TOOLS" },
  { value: "TOYO" },
  { value: "TRENDY" },
  { value: "TVS" },
  { value: "U CAP" },
  { value: "VALEO" },
  { value: "VALVOLINE" },
  { value: "VAN" },
  { value: "VEEDOL" },
  { value: "VEETHREE" },
  { value: "VESCO" },
  { value: "VIR" },
  { value: "VIR GREASE" },
  { value: "WABCO" },
  { value: "WAHAN" },
  { value: "WAXPOL" },
  { value: "WIPER" },
  { value: "WIPEX" },
  { value: "WURTH" },
  { value: "YATRIK" },
  { value: "YORK" },
  { value: "ZEUS" },
  { value: "ZF" },
  { value: "" },
];
export default Itemgroup;
