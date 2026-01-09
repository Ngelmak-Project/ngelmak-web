import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 24648,
  login: 'p@OUkOva\\jNR\\]CwWQ7\\GgOVieB',
};

export const sampleWithPartialData: IUser = {
  id: 28007,
  login: 'zWvl?@PbK',
};

export const sampleWithFullData: IUser = {
  id: 15490,
  login: 'MuUJ.G',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
