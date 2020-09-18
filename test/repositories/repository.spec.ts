import { PlaceRepository } from '../../src/repositories/repository';
import { PlaceRepositoryType } from '../../src/repositories/interfaces';
import { generateMockRepository } from '../../src/repositories/utilities';

describe('PlaceRepository', () => {
    let repository: PlaceRepository;
    let mock_data: any;

    beforeEach(() => {
        mock_data = generateMockRepository({
            repo_type: PlaceRepositoryType.Driver,
        });
        repository = new PlaceRepository(mock_data);
    });

    it('should create instance', () => {
        expect(repository).toBeTruthy();
        expect(repository).toBeInstanceOf(PlaceRepository);
    });

    it('should expose properties', () => {
        expect(repository.commit_hash).toBe(mock_data.commit_hash);
        expect(repository.folder_name).toBe(mock_data.folder_name);
        expect(repository.description).toBe(mock_data.description);
        expect(repository.uri).toBe(mock_data.uri);
        expect(repository.type).toBe(PlaceRepositoryType.Driver);
    });
});
