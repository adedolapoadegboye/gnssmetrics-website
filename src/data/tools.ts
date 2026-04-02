export interface Tool {
  href: string;
  title: string;
  desc: string;
  tags: string[];
  status: 'live' | 'soon';
  icon: string;
}

export const tools: Tool[] = [
  {
    href: '/tools/gnss-analyzer',
    title: 'GNSS Analyzer',
    desc: 'Full NMEA, RINEX, RTK and Quectel PQTM analysis suite. Multi-file, multi-constellation.',
    tags: ['NMEA', 'RINEX', 'RTK', 'PQTM'],
    status: 'live',
    icon: '⚙️',
  },
  {
    href: '/tools/time-converter',
    title: 'GNSS Time Converter',
    desc: 'Convert between GPS Week/TOW, UTC, Unix, Julian Date, Day of Year and all constellation epochs. Handles leap seconds and GPS week rollover.',
    tags: ['GPS', 'Galileo', 'BeiDou', 'GLONASS'],
    status: 'live',
    icon: '⏱️',
  },
  {
    href: '/tools/nmea-converter',
    title: 'NMEA to KML / GeoJSON',
    desc: 'Upload an NMEA log file and download a track as KML, KMZ or GeoJSON — ready to open in Google Earth or QGIS.',
    tags: ['NMEA', 'KML', 'GeoJSON'],
    status: 'live',
    icon: '🗺️',
  },
  {
    href: '/tools/dop-calculator',
    title: 'DOP Calculator',
    desc: 'Enter satellite azimuths and elevations, compute HDOP, VDOP and PDOP from the design matrix.',
    tags: ['HDOP', 'VDOP', 'PDOP'],
    status: 'live',
    icon: '📐',
  },
  {
    href: '/tools/rinex-inspector',
    title: 'RINEX Header Inspector',
    desc: 'Upload a RINEX 2 or 3 observation file and inspect header metadata — receiver, antenna, observables, epochs — without needing any software.',
    tags: ['RINEX', 'Observation'],
    status: 'soon',
    icon: '🔍',
  },
  {
    href: '/tools/coordinate-converter',
    title: 'Coordinate Converter',
    desc: 'Convert between ECEF Cartesian, Geodetic (lat/lon/height) and ENU. Supports WGS84 and GRS80.',
    tags: ['ECEF', 'Geodetic', 'ENU'],
    status: 'soon',
    icon: '🌐',
  },
  {
    href: '/tools/nmea-decoder',
    title: 'NMEA Sentence Decoder',
    desc: 'Paste any NMEA sentence — GGA, RMC, GSA, GSV — and get a field-by-field breakdown with validation.',
    tags: ['NMEA', 'GGA', 'RMC'],
    status: 'soon',
    icon: '📋',
  },
  {
    href: '/tools/klobuchar',
    title: 'Klobuchar Calculator',
    desc: 'Enter the 8 Klobuchar coefficients from a GPS navigation message and compute the ionospheric delay on L1.',
    tags: ['Ionosphere', 'L1', 'GPS'],
    status: 'soon',
    icon: '🌤️',
  },
  {
    href: '/tools/ubx-parser',
    title: 'UBX Frame Parser',
    desc: 'Paste u-blox UBX hex bytes and decode the message class, ID, payload fields and checksum.',
    tags: ['UBX', 'u-blox', 'Binary'],
    status: 'soon',
    icon: '🔩',
  },
];