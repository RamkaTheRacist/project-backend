import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { MovieService } from "../movie/movie.service";
import { GenresService } from "../genres/genres.service";
import { PeopleService } from "../people/people.service";



@Injectable()
export class ParseService {
    constructor(private movieService: MovieService,
        private genreService: GenresService,
        private peopleService: PeopleService) {
    }


    async parse() {
        const actors = [];
        const directors = [];
        const producers = [];
        const operators = [];
        const writers = [];
        const urls = [];
        const posters = [];
        
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
        });
        // перехожу на страницу со списком фильмов, 2 страницы для теста делал, в идеале 15-20 спарсить
        for (let i = 1; i < 2; i++) {
            let pageUrl = `https://www.kinopoisk.ru/lists/movies/?page=${i}`
            let page = await browser.newPage();
            await page.goto(pageUrl, {
                waitUntil: 'domcontentloaded'
            });
            // пушу ссылки фильмов в массив
            const movies = await page.$$('.styles_root__ti07r');
            for (const movie of movies) {
                const linkEl = await movie.$('.styles_root__wgbNq');
                const link = await linkEl.evaluate(el => el.getAttribute('href'));
                const url = 'https://www.kinopoisk.ru/' + link;
                urls.push(url);
            }
            // по каждой ссылке все тяну с фильма
            for (const url of urls) {
                await page.goto(url, {
                    waitUntil: 'domcontentloaded',
                });


                const titleEl = await page.$('.styles_title__65Zwx');
                const titleText = await page.evaluate((el: HTMLElement) => el.innerText, titleEl);
                const title = titleText.split(' ');
                console.log(title[0]);

                const originalTitleEl = await page.$('.styles_originalTitle__JaNKM');                                   //второе название
                if (originalTitleEl) {
                    const originalTitle = await page.evaluate((el: HTMLElement) => el.innerText.trim(), originalTitleEl);
                    console.log(originalTitle);
                }


                const ageRateEl = await page.$('.styles_ageRate__340KC');
                const ageRate = await page.evaluate((el: HTMLElement) => el.innerText.trim(), ageRateEl);
                console.log(ageRate);

                const elements = await page.$$('[data-test-id="encyclopedic-table"] .styles_row__da_RK');
                for (const element of elements) {
                    const titleEl = await element.$('.styles_title__b1HVo');
                    const title = await page.evaluate((el: HTMLElement) => el.innerText.trim(), titleEl);

                    await new Promise(resolve => setTimeout(resolve, 1000));

                    switch (title) {
                        case 'Год производства':
                            const yearEl = await element.$('.styles_value__g6yP4');
                            const year = await page.evaluate((el: HTMLElement) => el.innerText.trim(), yearEl);
                            console.log(year);
                            break;
                        case 'Жанр':
                            const genreEl = await element.$('.styles_value__g6yP4 .styles_value__g6yP4');
                            const genre = await page.evaluate((el: HTMLElement) => el.innerText.trim(), genreEl);
                            const genres = genre.split(',');
                            console.log(genres);
                            break;
                        case 'Страна':
                            const countryEl = await element.$('.styles_value__g6yP4');
                            const country = await page.evaluate((el: HTMLElement) => el.innerText.trim(), countryEl);
                            console.log(country);
                            break;
                        case 'Премьера в России':
                            const premierRussiaEl = await element.$('.styles_value__g6yP4 .styles_link__3QfAk');
                            const premierRussia = await page.evaluate((el: HTMLElement) => el.innerText.trim(), premierRussiaEl);
                            console.log(premierRussia);
                            break;
                        case 'Премьера в мире':
                            const premierEl = await element.$('.styles_value__g6yP4 .styles_link__3QfAk');
                            const premier = await page.evaluate((el: HTMLElement) => el.innerText.trim(), premierEl);
                            console.log(premier);
                            break;
                    }


                }
                const descriptionEl = await page.$('.styles_paragraph__wEGPz');
                const description = await page.evaluate((el: HTMLElement) => el.innerText, descriptionEl);
                console.log(description);


                await page.goto(url + 'cast/who_is/actor/', {
                    waitUntil: 'domcontentloaded',
                });

                await new Promise(resolve => setTimeout(resolve, 1500));

                const actorsEl = await page.$$('.dub .info .name');
                for (const actor of actorsEl) {
                    const nameEl = await actor.$('a')
                    const name = await page.evaluate((el: HTMLElement) => el.innerText.trim(), nameEl);
                    actors.push(name);
                }

                await new Promise(resolve => setTimeout(resolve, 1500));

                await page.goto(url + 'cast/who_is/director/', {
                    waitUntil: 'domcontentloaded',
                });

                const directorEl = await page.$$('.dub .info .name');
                for (const director of directorEl) {
                    const nameEl = await director.$('a')
                    const name = await page.evaluate((el: HTMLElement) => el.innerText.trim(), nameEl);
                    directors.push(name);
                }


                await new Promise(resolve => setTimeout(resolve, 1500));

                await page.goto(url + 'cast/who_is/producer/', {
                    waitUntil: 'domcontentloaded',
                });

                const producerEl = await page.$$('.dub .info .name');
                for (const producer of producerEl) {
                    const nameEl = await producer.$('a')
                    const name = await page.evaluate((el: HTMLElement) => el.innerText.trim(), nameEl);
                    producers.push(name);
                }

                await new Promise(resolve => setTimeout(resolve, 1500));

                await page.goto(url + 'cast/who_is/writer/', {
                    waitUntil: 'domcontentloaded',
                });

                const writerEl = await page.$$('.dub .info .name');
                for (const writer of writerEl) {
                    const nameEl = await writer.$('a')
                    const name = await page.evaluate((el: HTMLElement) => el.innerText.trim(), nameEl);
                    writers.push(name);
                }



                await page.goto(url + 'cast/who_is/operator/', {
                    waitUntil: 'domcontentloaded',
                });

                const operatorEl = await page.$$('.dub .info .name');
                for (const operator of operatorEl) {
                    const nameEl = await operator.$('a')
                    const name = await page.evaluate((el: HTMLElement) => el.innerText.trim(), nameEl);
                    operators.push(name);
                }

                await new Promise(resolve => setTimeout(resolve, 1500));



                await page.goto(url + 'posters/', {
                    waitUntil: 'domcontentloaded',
                });

                const tmpImgs = await page.$$('.styles_content__MF1k9 .styles_root__iY1K3 .styles_root__oV7Oq');
                for (const img of tmpImgs) {
                    const cutLinkEl = await img.$('.styles_root__OQv_q');
                    const cutLink = await cutLinkEl.evaluate(el => el.getAttribute('href'));
                    posters.push('https:' + cutLink);
                    
                }

                console.log(posters);
        
                console.log(operators);
                console.log(writers);
                console.log(producers);
                console.log(actors);
                console.log(directors);
                // Обнуляю массивы
                posters.length = 0;
                operators.length = 0;
                writers.length = 0;
                producers.length = 0;
                actors.length = 0;
                directors.length = 0;
            }
            urls.length = 0;

            // закрываю страницу
            await page.close();

        }
    }

}

    // Надо вытянуть всю подобную инфу типо страна, слоган и т д
    // Но миллион ифов не варик писать, нужно будет с сайта много что тянуть
    // Пока что такие варианты (придумал на сонную голову, если что придет в голову пиши в тг или если с каким-то согласен):
    // 1. Сделать через switch/case (все равно много кода, но не так плохо выглядит)
    // 2. Создать массив с тайтлами которые нужно вытянуть, потом сделать цикл по массиву и как только тайтл совпадет
    // с названием в массиве тянуть его и переходить на следующий элемент цикла (слишком много кода и будет не особо читаемо)
    // 3. Не придумывать велосипед, вытянуть все тайтлы и дернуть с каждого инфу, так то нам все равно
    // нужна инфа со всех тайтлов в "О фильме" (как по мне норм варик, надо будет попробовать)
    // Если будешь что-то менять/делать и пушить файл, коммить тогда что изменил, будем привыкать потиху
    // Пока работаем с "О фильме", как только сделаем это по красоте, остальные колонки спарсим по аналогии
    // и перейдем уже к тому, что сделаем цикл который будет на каждый фильм переходить и все парсить
    // Таймауты пока не пишем, будем писать только когда надо будет постоянно страницы менять, пока работаем с одной
    // Комменты из функции можешь удалить, я их оставил чтобы тебе проще было влиться в puppeteer
    // Эти комменты не удаляй пусть будут, будем еще добавлять сюда инфу/способы, потом удалим их




