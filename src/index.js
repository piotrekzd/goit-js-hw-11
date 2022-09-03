import './sass/index.scss';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { images } from './images';

const lightbox = new simpleLightbox('.gallery a');
const perPage = 40;
let page = 1;
let query = '';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

form.addEventListener('submit', searchForImages);
loadMore.addEventListener('submit', getMoreImages);

function clear() {
    gallery.innerHTML = '';
};

function searchForImages(e) {
    e.preventDefault();
    query = e.currentTarget.searchQuery.value.trim();
    loadMore.classList.add('is-hidden');
    clear();
    if (!query) {
        Notiflix.Notify.info("Feel free to look for some images!")
        return;
    };
images(query, page, perPage)
    .then(({ data }) => {
        if (!data.totalHits) {
            Notiflix.Notify.failure('Sorry, we have not found any images matching your query... Please try again.');
        }
        else {
            getGallery(data.hits);
            lightbox.refresh();
            Notiflix.Notify.success(`We have found ${data.totalHits} images!`)
        }
 })
};

function getMoreImages() {
    page += 1;
    images(query, page, perPage)
        .then(({ data }) => {
            getGallery(data.this);
            lightbox.refresh();
            const allPages = Math.ceil(data.hits / perPage);
            if (page > allPages) {
                loadMore.classList.add('.is-hidden');
                Notiflix.Notify.failure('Sorry, you have reached the limit of search results.');
            }
        }
        )
        .catch(error => console.log(error));
};

function getGallery(data) {
    const markup = data
        .map(
            ({
                webformatURL,
                largeImageURL,
                tags,
                likes,
                views,
                comments,
                downloads,
            }) => {
                return `<div class="photo-card">
                <a href="${largeImageURL}"> <img src="${webformatURL}" alt="${tags}" loading="lazy" title=""/></a>
                <div class="info">
                <p class="item-info">
                <b>Likes</b>${likes}</p>
                <p class="item-info">
                <b>Views</b>${views}</p>
                <p class="item-info">
                <b>Comments</b>${comments}</p>
                <p class="item-info">
                <b>Downloads</b>${downloads}</p>
                </div>
                </div>`
            }
        )
        .join('');
    
    gallery.insertAdjacentHTML('beforeend', markup);
};