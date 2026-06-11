export interface AEDLocation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  floor?: string;
  accessible: boolean;
}

export const mockAEDs: AEDLocation[] = [
  { id: 'AED001', name: 'Blk 101 Ang Mo Kio Ave 3', address: '101 Ang Mo Kio Avenue 3, #01-01', lat: 1.3691, lng: 103.8484, floor: 'Void Deck', accessible: true },
  { id: 'AED002', name: 'Ang Mo Kio Hub', address: '53 Ang Mo Kio Ave 3', lat: 1.3698, lng: 103.8486, floor: 'Level 1 Info Counter', accessible: true },
  { id: 'AED003', name: 'Blk 209 Toa Payoh North', address: '209 Toa Payoh North', lat: 1.3412, lng: 103.8498, floor: 'Void Deck', accessible: true },
  { id: 'AED004', name: 'Toa Payoh HDB Hub', address: '490 Lorong 6 Toa Payoh', lat: 1.3326, lng: 103.8498, floor: 'Level 1', accessible: true },
  { id: 'AED005', name: 'Blk 682 Hougang Ave 8', address: '682 Hougang Avenue 8', lat: 1.3570, lng: 103.8851, floor: 'Void Deck', accessible: true },
  { id: 'AED006', name: 'Heartbeat@Bedok', address: '11 Bedok North St 1', lat: 1.3270, lng: 103.9350, floor: 'Level 1', accessible: true },
  { id: 'AED007', name: 'Blk 85 Bedok North St 4', address: '85 Bedok North Street 4', lat: 1.3280, lng: 103.9370, floor: 'Void Deck', accessible: true },
  { id: 'AED008', name: 'Tampines Mall', address: '4 Tampines Central 5', lat: 1.3525, lng: 103.9455, floor: 'Level 1 Customer Service', accessible: true },
  { id: 'AED009', name: 'Blk 201 Tampines St 21', address: '201 Tampines Street 21', lat: 1.3540, lng: 103.9438, floor: 'Void Deck', accessible: true },
  { id: 'AED010', name: 'Jurong East CC', address: '21 Jurong East St 31', lat: 1.3480, lng: 103.7340, floor: 'Level 1', accessible: true },
  { id: 'AED011', name: 'Blk 308 Punggol Walk', address: '308 Punggol Walk', lat: 1.4043, lng: 103.9020, floor: 'Void Deck', accessible: true },
  { id: 'AED012', name: 'Sengkang CC', address: '2 Sengkang Square', lat: 1.3915, lng: 103.8945, floor: 'Level 1', accessible: true },
  { id: 'AED013', name: 'Blk 412 Yishun Ring Road', address: '412 Yishun Ring Road', lat: 1.4189, lng: 103.8392, floor: 'Void Deck', accessible: true },
  { id: 'AED014', name: 'Woodlands Civic Centre', address: '900 South Woodlands Dr', lat: 1.4371, lng: 103.7866, floor: 'Level 1', accessible: true },
  { id: 'AED015', name: 'Blk 123 Bukit Merah View', address: '123 Bukit Merah View', lat: 1.2862, lng: 103.8148, floor: 'Void Deck', accessible: true },
];
