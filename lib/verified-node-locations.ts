export type LocationSource = 'Registered EchoSync node' | 'OneMap geocoded' | 'Manual address geocode';
export type LocationAccuracy = 'Block-level verified' | 'Block-level estimate' | 'Address verified, block-level estimate';

export interface VerifiedIncidentLocation {
  nodeId: string;
  address: string;
  block: string;
  unit: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  locationSource: LocationSource;
  accuracy: LocationAccuracy;
}

export interface OneMapResolvedLocation {
  latitude: number;
  longitude: number;
  matchedAddress: string;
  postalCode?: string;
  source: 'OneMap geocoding';
  accuracy: 'Block-level estimate';
}

export interface FallbackIncidentLocation {
  address: string;
  latitude: number;
  longitude: number;
}

export const verifiedNodeLocations: Record<string, VerifiedIncidentLocation> = {
  'NODE-TAM-124-04-12': {
    nodeId: 'NODE-TAM-124-04-12',
    address: 'Blk 124 Tampines Street 11, #04-12',
    block: '124',
    unit: '#04-12',
    postalCode: '521124',
    latitude: 1.34518428911075,
    longitude: 103.949793325094,
    locationSource: 'Registered EchoSync node',
    accuracy: 'Block-level verified',
  },
  'NODE-AMK-302-11-08': {
    nodeId: 'NODE-AMK-302-11-08',
    address: 'Blk 302 Ang Mo Kio Ave 3, #11-08',
    block: '302',
    unit: '#11-08',
    postalCode: '560302',
    latitude: 1.36708983179046,
    longitude: 103.845660199054,
    locationSource: 'Registered EchoSync node',
    accuracy: 'Block-level verified',
  },
  'NODE-JW-518-03-44': {
    nodeId: 'NODE-JW-518-03-44',
    address: 'Blk 518 Jurong West St 52, #03-44',
    block: '518',
    unit: '#03-44',
    postalCode: '640518',
    latitude: 1.34508681384068,
    longitude: 103.717978485296,
    locationSource: 'Registered EchoSync node',
    accuracy: 'Block-level verified',
  },
  'NODE-BED-411-08-15': {
    nodeId: 'NODE-BED-411-08-15',
    address: 'Blk 411 Bedok North Ave 2, #08-15',
    block: '411',
    unit: '#08-15',
    postalCode: '460411',
    latitude: 1.32830977781597,
    longitude: 103.931761785189,
    locationSource: 'Registered EchoSync node',
    accuracy: 'Block-level verified',
  },
  'NODE-WDL-789-06-22': {
    nodeId: 'NODE-WDL-789-06-22',
    address: 'Blk 789 Woodlands Ave 6, #06-22',
    block: '789',
    unit: '#06-22',
    postalCode: '730789',
    latitude: 1.44337046612204,
    longitude: 103.802406420773,
    locationSource: 'Registered EchoSync node',
    accuracy: 'Block-level verified',
  },
  'NODE-HDB-302-08-112': {
  nodeId: 'NODE-HDB-302-08-112',
  address: 'Blk 302 Ang Mo Kio Ave 3, #08-112',
  block: '302',
  unit: '#08-112',
  postalCode: '560302',
  latitude: 1.36708983179046,
  longitude: 103.845660199054,
  locationSource: 'Registered EchoSync node',
  accuracy: 'Block-level verified',
},
};

const incidentNodeIds: Record<string, string> = {
  'INC-2026-089': 'NODE-TAM-124-04-12',
  'INC-2026-088': 'NODE-AMK-302-11-08',
  'INC-2026-087': 'NODE-JW-518-03-44',
  'INC-2026-086': 'NODE-BED-411-08-15',
  'INC-2026-085': 'NODE-WDL-789-06-22',
  'INC-2026-090': 'NODE-AMK-302-11-08',
  'INC-2026-091': 'NODE-JW-518-03-44',
};

export function resolveIncidentLocation(addressOrNodeId: string): VerifiedIncidentLocation | null {
  const directNode = verifiedNodeLocations[addressOrNodeId];
  if (directNode) return directNode;

  const incidentNodeId = incidentNodeIds[addressOrNodeId];
  if (incidentNodeId) return verifiedNodeLocations[incidentNodeId];

  const normalizedInput = normalizeAddress(addressOrNodeId);
  const matchedLocation = Object.values(verifiedNodeLocations).find(
    (location) => normalizeAddress(location.address) === normalizedInput
  );

  if (matchedLocation) return matchedLocation;

  return null;
}

export function toIncidentLocationFields(location: VerifiedIncidentLocation) {
  return {
    location: location.address,
    lat: location.latitude,
    lng: location.longitude,
    nodeId: location.nodeId,
    block: location.block,
    unit: location.unit,
    postalCode: location.postalCode,
    locationSource: location.locationSource,
    locationAccuracy: location.accuracy,
  };
}

export function resolveLocationWithPriority({
  addressOrNodeId,
  oneMapLocation,
  fallback,
}: {
  addressOrNodeId: string;
  oneMapLocation?: OneMapResolvedLocation | null;
  fallback: FallbackIncidentLocation;
}) {
  const verifiedLocation = resolveIncidentLocation(addressOrNodeId);
  if (verifiedLocation) return toIncidentLocationFields(verifiedLocation);

  if (oneMapLocation) {
    return {
      location: fallback.address,
      lat: oneMapLocation.latitude,
      lng: oneMapLocation.longitude,
      postalCode: oneMapLocation.postalCode,
      locationSource: 'OneMap geocoded',
      locationAccuracy: oneMapLocation.accuracy,
    };
  }

  return {
    location: fallback.address,
    lat: fallback.latitude,
    lng: fallback.longitude,
    locationSource: 'Manual address geocode',
    locationAccuracy: 'Address verified, block-level estimate',
  };
}

export function cleanAddressForOneMap(address: string) {
  return address
    .replace(/#\d{1,3}-\d{1,4}/gi, '')
    .replace(/\bBlk\b/gi, '')
    .replace(/\bSt\b/gi, 'Street')
    .replace(/\bAve\b/gi, 'Avenue')
    .replace(/,/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeAddress(value: string) {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}
