import { NextResponse } from 'next/server';
import { cleanAddressForOneMap } from '@/lib/verified-node-locations';

type OneMapSearchResult = {
  SEARCHVAL?: string;
  BLK_NO?: string;
  ROAD_NAME?: string;
  BUILDING?: string;
  ADDRESS?: string;
  POSTAL?: string;
  LATITUDE?: string;
  LONGITUDE?: string;
};

type OneMapSearchResponse = {
  found?: number;
  results?: OneMapSearchResult[];
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address?.trim()) {
    return NextResponse.json(
      { error: 'Missing address query parameter' },
      { status: 400 }
    );
  }

  const cleanedAddress = cleanAddressForOneMap(address);
  const url = new URL('https://www.onemap.gov.sg/api/common/elastic/search');
  url.searchParams.set('searchVal', cleanedAddress);
  url.searchParams.set('returnGeom', 'Y');
  url.searchParams.set('getAddrDetails', 'Y');
  url.searchParams.set('pageNum', '1');

  try {
    const response = await fetch(url, {
      headers: { accept: 'application/json' },
      next: { revalidate: 60 * 60 * 24 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'OneMap geocoding failed', cleanedAddress },
        { status: 502 }
      );
    }

    const data = await response.json() as OneMapSearchResponse;
    const result = data.results?.find((item) => item.LATITUDE && item.LONGITUDE);

    if (!result) {
      return NextResponse.json(
        { error: 'No OneMap block-level match found', cleanedAddress },
        { status: 404 }
      );
    }

    const latitude = Number(result.LATITUDE);
    const longitude = Number(result.LONGITUDE);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return NextResponse.json(
        { error: 'OneMap returned invalid coordinates', cleanedAddress },
        { status: 502 }
      );
    }

    return NextResponse.json({
      latitude,
      longitude,
      matchedAddress: result.ADDRESS || result.SEARCHVAL || cleanedAddress,
      postalCode: result.POSTAL || undefined,
      source: 'OneMap geocoding',
      accuracy: 'Block-level estimate',
    });
  } catch {
    return NextResponse.json(
      { error: 'Unable to reach OneMap geocoding service', cleanedAddress },
      { status: 502 }
    );
  }
}
