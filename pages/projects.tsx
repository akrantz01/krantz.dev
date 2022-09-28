import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faHouse, faPenNib } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetStaticProps } from 'next';
import Link from 'next/link';

import Animate from '@/components/Animate';
import Layout from '@/components/Layout';
import { loadProjects } from '@/lib';
import { Projects } from '@/types';

const actionClasses =
  'relative inline-flex justify-center w-full sm:w-10 h-10 px-3 py-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-700 dark:hover:text-white border border-gray-100 dark:border-gray-500 rounded-lg text-sm font-medium default-transition default-focus';

interface Props {
  projects: Projects;
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const projects = await loadProjects();
  return { props: { projects } };
};

const Projects = ({ projects }: Props): JSX.Element => (
  <Layout>
    <div className="my-24 mx-2 sm:mx-6 lg:mb-28 lg:mx-8">
      <div className="relative max-w-xl mx-auto">
        <ul className="flex flex-col space-y-4" role="list">
          {projects.map((project, index) => (
            <Animate animation={{ y: [50, 0], opacity: [0, 1] }} key={index} transition={{ delay: 0.1 * index }}>
              <li className="bg-gray-50 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 backdrop-filter backdrop-blur-sm border border-gray-100 dark:border-gray-500 rounded-lg transition ease-in-out duration-300">
                <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 sm:px-6">
                  <div className="flex flex-1 items-center justify-start w-full">
                    {project.icon}
                    <div className="min-w-0 flex-1 px-4">
                      <h1 className="text-gray-700 dark:text-white text-lg font-bold">{project.title}</h1>
                      <p className="flex items-center mt-1 text-gray-500 dark:text-gray-400 text-xs">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  <div className="inline-flex items-center justify-end space-x-2 w-full sm:w-auto mt-4 sm:mt-1">
                    {project.links.post && (
                      <Link aria-label={`${project.title} blog post`} href={`/blog/${project.links.post}`} passHref>
                        <a className={actionClasses}>
                          <span className="sr-only">Blog post</span>
                          <FontAwesomeIcon icon={faPenNib} />
                        </a>
                      </Link>
                    )}
                    {project.links.homepage && (
                      <a
                        aria-label={`${project.title} homepage`}
                        href={project.links.homepage}
                        className={actionClasses}
                        rel="noreferrer"
                        target="_blank"
                      >
                        <span className="sr-only">Homepage</span>
                        <FontAwesomeIcon icon={faHouse} />
                      </a>
                    )}
                    <a
                      aria-label={`${project.title} GitHub`}
                      href={project.links.github}
                      className={actionClasses}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <span className="sr-only">GitHub</span>
                      <FontAwesomeIcon icon={faGithub} />
                    </a>
                  </div>
                </div>
              </li>
            </Animate>
          ))}
        </ul>
      </div>
    </div>
  </Layout>
);

export default Projects;
