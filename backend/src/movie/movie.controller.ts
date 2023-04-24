import { Controller, Get, Param } from '@nestjs/common';
import { MovieService } from "./movie.service";

@Controller('movie')
export class MovieController {
    constructor(private movieService: MovieService) {
    }

    @Get()
    async getMovies() {
        return this.movieService.getAllMovies();
    }

    @Get('/age/:ageRate')
    async getMovieByAgeRate(@Param('ageRate') ageRate: number) {
        return this.movieService.getMovieByAgeRate(ageRate);
    }

    @Get('/country/:countries')
    async getMovieByCountry(@Param('countries') countries: string) {
        return this.movieService.getMovieByCountry(countries);
    }

    @Get('/genre/:genre')
    async getMovieByGenre(@Param('genre') genre: string){
        return this.movieService.getMovieByGenre(genre);
    }

    @Get('/rate/:rate')
    async getMovieByRate(@Param('rate') rate: number){
        return this.movieService.getMovieByRate(rate)
    }

    @Get('/ratequan/:ratequan')
    async getMovieByRateQuantity(@Param('ratequan') rateQuantity: number){
        return this.movieService.getMovieByRateQuantity(rateQuantity)
    }

    @Get('/:id')
    async getMovie(@Param('id') id: number) {
        return this.movieService.getMovie(id);
    }

    @Get('/:id/people')
    async getMoviePeople(@Param('id') film_id: number) {
        return this.movieService.getMoviePeople(film_id);
    }

    @Get('/:id/genres')
    async getMovieGenres(@Param('id') film_id: number) {
        return this.movieService.getMovieGenres(film_id);
    }

    @Get('/:id/images')
    async getMovieImages(@Param('id') film_id: number) {
        return this.movieService.getMovieImages(film_id);
    }


}
