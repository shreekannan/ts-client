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

    it('should expose commit hash', () => {
        expect(repository.commit_hash).toBe(mock_data.commit_hash);
    });

    it('should expose folder name', () => {
        expect(repository.folder_name).toBe(mock_data.folder_name);
    });

    it('should expose description', () => {
        expect(repository.description).toBe(mock_data.description);
    });

    it('should expose URI', () => {
        expect(repository.uri).toBe(mock_data.uri);
    });

    it('should expose type', () => {
        expect(repository.type).toBe(PlaceRepositoryType.Driver);
    });
});
