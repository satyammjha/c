import React, { useEffect, useState } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from '@/components/ui/carousel';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


const SkillResources = ({ skills }) => {
    const [resources, setResources] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchYouTubeVideos = async (skill) => {
        try {
            const response = await axios.get(
                'https://www.googleapis.com/youtube/v3/search',
                {
                    params: {
                        part: 'snippet',
                        q: `${skill} tutorial`,
                        type: 'video',
                        maxResults: 3,
                        // key: YOUTUBE_API_KEY
                    }
                }
            );
            return response.data.items.map(item => ({
                type: 'video',
                title: item.snippet.title,
                link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                thumbnail: item.snippet.thumbnails.default.url
            }));
        } catch (err) {
            console.error('YouTube API Error:', err);
            return [];
        }
    };

    const fetchDevToArticles = async (skill) => {
        try {
            const response = await axios.get(
                'https://dev.to/api/articles',
                {
                    params: {
                        tag: skill,
                        per_page: 3
                    },
                    headers: DEV_TO_API_KEY ? {
                        'api-key': DEV_TO_API_KEY
                    } : {}
                }
            );
            return response.data.map(article => ({
                type: 'article',
                title: article.title,
                link: article.url,
                description: article.description
            }));
        } catch (err) {
            console.error('Dev.to API Error:', err);
            return [];
        }
    };

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const results = {};

                for (const skill of skills) {
                    const [videos, articles] = await Promise.all([
                        fetchYouTubeVideos(skill),
                        fetchDevToArticles(skill)
                    ]);

                    results[skill] = {
                        videos: videos.slice(0, 3),
                        articles: articles.slice(0, 3)
                    };
                }

                setResources(results);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch resources');
                setLoading(false);
            }
        };

        fetchResources();
    }, [skills]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Skill Development Resources</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
                {loading ? (
                    <div className="text-center py-4">Loading resources...</div>
                ) : error ? (
                    <div className="text-center py-4 text-red-500">{error}</div>
                ) : (
                    <Carousel className="w-full">
                        <CarouselContent className="-ml-4">
                            {Object.entries(resources).map(([skill, data], index) => (
                                <CarouselItem
                                    key={index}
                                    className="pl-4 md:basis-1/2 lg:basis-1/3"
                                >
                                    <Card className="h-full m-2">
                                        <CardContent className="p-4">
                                            <h4 className="font-semibold mb-4">
                                                Resources for {skill}
                                            </h4>

                                            <Tabs defaultValue="videos" className="w-full">
                                                <TabsList className="grid grid-cols-2 w-full">
                                                    <TabsTrigger value="videos">Videos</TabsTrigger>
                                                    <TabsTrigger value="articles">Articles</TabsTrigger>
                                                </TabsList>

                                                <TabsContent value="videos">
                                                    <div className="space-y-4">
                                                        {data.videos.map((video, idx) => (
                                                            <a
                                                                key={idx}
                                                                href={video.link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="block group"
                                                            >
                                                                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                                                    <img
                                                                        src={video.thumbnail}
                                                                        alt="thumbnail"
                                                                        className="w-16 h-12 rounded-md object-cover"
                                                                    />
                                                                    <div>
                                                                        <p className="font-medium text-sm group-hover:text-primary line-clamp-2">
                                                                            {video.title}
                                                                        </p>
                                                                        <span className="text-xs text-muted-foreground">
                                                                            YouTube
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </a>
                                                        ))}
                                                        {data.videos.length === 0 && (
                                                            <p className="text-muted-foreground text-sm">
                                                                No videos found
                                                            </p>
                                                        )}
                                                    </div>
                                                </TabsContent>

                                                <TabsContent value="articles">
                                                    <div className="space-y-4">
                                                        {data.articles.map((article, idx) => (
                                                            <a
                                                                key={idx}
                                                                href={article.link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="block group"
                                                            >
                                                                <div className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                                                    <p className="font-medium text-sm group-hover:text-primary line-clamp-2">
                                                                        {article.title}
                                                                    </p>
                                                                    {article.description && (
                                                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                                            {article.description}
                                                                        </p>
                                                                    )}
                                                                    <span className="text-xs text-muted-foreground">
                                                                        Dev.to
                                                                    </span>
                                                                </div>
                                                            </a>
                                                        ))}
                                                        {data.articles.length === 0 && (
                                                            <p className="text-muted-foreground text-sm">
                                                                No articles found
                                                            </p>
                                                        )}
                                                    </div>
                                                </TabsContent>
                                            </Tabs>
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-2" />
                        <CarouselNext className="right-2" />
                    </Carousel>
                )}
            </CardContent>
        </Card>
    );
};

export default SkillResources;