import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';

const BlogDetails = ({ blog }) => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <Card className="shadow-lg rounded-lg overflow-hidden">
                    <CardHeader className="relative">
                        <img 
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-64 md:h-80 object-cover"
                        />
                    </CardHeader>
                    <CardContent className="p-6">
                        <CardTitle className="text-3xl font-bold mb-4 text-gray-900">
                            {blog.title}
                        </CardTitle>
                        <CardDescription className="text-lg text-gray-700 leading-relaxed">
                            {blog.description}
                        </CardDescription>
                    </CardContent>
                    <CardFooter className="p-6 bg-gray-50">
                        <div className="flex flex-wrap gap-2">
                            {blog.referenceLinks.map((link, index) => (
                                <Button 
                                    key={index} 
                                    asChild 
                                    variant="outline"
                                    className="transition-transform transform hover:scale-105"
                                >
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium text-gray-700 hover:text-gray-900"
                                    >
                                        {link.text}
                                    </a>
                                </Button>
                            ))}
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default BlogDetails;