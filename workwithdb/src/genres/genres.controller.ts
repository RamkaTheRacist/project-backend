import { Controller } from '@nestjs/common';
import {GenresService} from "./genres.service";
import {EventPattern} from "@nestjs/microservices";

@Controller('genres')
export class GenresController {
    constructor(private genresService: GenresService) {
    }

    @EventPattern('create_genres')
    async createGenres({id, arr}) {
        return this.genresService.createGenres(id, arr);
    }
}
