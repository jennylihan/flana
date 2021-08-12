/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
};

export type BottomTabParamList = {
  Document: undefined;
  Map: undefined;
};

export type TabOneParamList = {
  DocumentScreen: undefined;
};

export type TabTwoParamList = {
  MapScreen: undefined;
};

export type DocumentScreenList = {
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
};