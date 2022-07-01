import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDocs, collection, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase.config';
import { Navigation, Pagination, A11y, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import { getAuth } from 'firebase/auth';
import editIcon from '../assets/svg/editIcon.svg';

export default function Slider() {
  const [news, setNews] = useState(null);

  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      const newsRef = collection(db, 'news');

      const q = query(newsRef, orderBy('timestamp', 'desc'));

      const querySnap = await getDocs(q);

      let news = [];

      querySnap.forEach((doc) => {
        return news.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      // console.log(news);
      setNews(news);
    };
    fetchNews();
  }, []);

  return (
    news && (
      <>
        <p className='exploreHeading'>News</p>

        <Swiper
          modules={[Navigation, Pagination, A11y, Autoplay]}
          slidesPerView={1}
          pagination
          navigation
        >
          {news.map(({ data, id }) => (
            <SwiperSlide key={id}>
              {auth.currentUser &&
                auth.currentUser.metadata.createdAt === '1656428823385' && (
                  <div
                    className='shareIconDiv'
                    onClick={() => {
                      navigate(`/edit-news/${id}`);
                    }}
                  >
                    <img src={editIcon} alt='' />
                  </div>
                )}
              <div
                onClick={() => navigate(`/${data.slug}`)}
                style={{
                  backgroundImage: `url(${data.imgUrl})`,
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                }}
                className='swiper-slide'
              >
                <p className='swiperSlideText'>{data.name}</p>

                {data.description ? (
                  <p className='swiperSlidePrice'>{data.description}</p>
                ) : null}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
}
