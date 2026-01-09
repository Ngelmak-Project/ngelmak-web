import { IAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  name: 'a156e735-bc12-4d94-b431-bd0c2caa32c3',
};

export const sampleWithPartialData: IAuthority = {
  name: 'ee179056-11f2-4aad-963b-938a9c5b20bc',
};

export const sampleWithFullData: IAuthority = {
  name: '6bb54e27-7e97-4530-8ef0-9bcbf8be325c',
};

export const sampleWithNewData: IAuthority = {
  name: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
