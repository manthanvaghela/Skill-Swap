from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import urllib.parse

# Import all the original modules
from skill_matcher import find_skill_matches, fallback_matching, USERS_DATABASE
from skill_recommender import (
    get_skill_recommendations, 
    get_fallback_recommendations,
    SKILL_CATEGORIES,
    CAREER_PATHS,
    TRENDING_SKILLS
)
from skill_gap_analyzer import (
    analyze_skill_gaps, 
    get_fallback_analysis,
    JOB_REQUIREMENTS
)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# ============================================================================
# HEALTH & STATUS ENDPOINTS
# ============================================================================

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy", 
        "message": "Unified Skills API is running",
        "services": {
            "skill_matcher": "Available",
            "skill_recommender": "Available", 
            "skill_gap_analyzer": "Available"
        }
    })

@app.route('/api/status', methods=['GET'])
def api_status():
    """Detailed API status and capabilities"""
    return jsonify({
        "success": True,
        "api_name": "Unified Skills API",
        "version": "1.0.0",
        "services": {
            "skill_matching": {
                "description": "Find users with complementary skills",
                "endpoints": ["/api/matches", "/api/users", "/api/user/<id>", "/api/add-user"]
            },
            "skill_recommendations": {
                "description": "Get personalized skill recommendations and learning paths",
                "endpoints": ["/api/recommendations", "/api/categories", "/api/career-paths", "/api/trending-skills", "/api/skills-analysis", "/api/learning-path"]
            },
            "skill_gap_analysis": {
                "description": "Analyze skill gaps for any role",
                "endpoints": ["/api/analyze", "/api/roles", "/api/role/<name>", "/api/compare-roles", "/api/skills-overview"]
            },
            "skill_swapper": {
                "description": "Keyword-based user search and ranking for Skill Swapper platform",
                "endpoints": ["/api/search-users", "/api/browse-users"]
            }
        },
        "total_endpoints": 17
    })

# ============================================================================
# SKILL MATCHER ENDPOINTS
# ============================================================================

@app.route('/api/matches', methods=['POST'])
def get_matches():
    """Get skill matches for a user"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        user_skills = data.get('user_skills', [])
        desired_skills = data.get('desired_skills', [])
        
        if not user_skills or not desired_skills:
            return jsonify({"error": "Both user_skills and desired_skills are required"}), 400
        
        matches = find_skill_matches(user_skills, desired_skills)
        
        if matches is None:
            matches = fallback_matching(user_skills, desired_skills)
        
        enhanced_matches = []
        for match in matches:
            user = next((u for u in USERS_DATABASE if u["id"] == match["userId"]), None)
            if user:
                enhanced_match = {
                    "userId": match["userId"],
                    "name": user["name"],
                    "matchScore": match["matchScore"],
                    "reasons": match["reasons"],
                    "userSkills": user["skills"],
                    "userSkillsWanted": user["skillsWanted"]
                }
                enhanced_matches.append(enhanced_match)
        
        return jsonify({
            "success": True,
            "service": "skill_matcher",
            "matches": enhanced_matches,
            "total_matches": len(enhanced_matches)
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/users', methods=['GET'])
def get_users():
    """Get all users in the database"""
    return jsonify({
        "success": True,
        "service": "skill_matcher",
        "users": USERS_DATABASE,
        "total_users": len(USERS_DATABASE)
    })

@app.route('/api/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Get a specific user by ID"""
    user = next((u for u in USERS_DATABASE if u["id"] == user_id), None)
    if user:
        return jsonify({
            "success": True,
            "service": "skill_matcher",
            "user": user
        })
    else:
        return jsonify({"error": "User not found"}), 404

@app.route('/api/add-user', methods=['POST'])
def add_user():
    """Add a new user to the database"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        required_fields = ['name', 'skills', 'skillsWanted']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        new_id = max(u["id"] for u in USERS_DATABASE) + 1 if USERS_DATABASE else 1
        
        new_user = {
            "id": new_id,
            "name": data["name"],
            "skills": data["skills"],
            "skillsWanted": data["skillsWanted"]
        }
        
        return jsonify({
            "success": True,
            "service": "skill_matcher",
            "message": "User would be added (not actually saved in this demo)",
            "user": new_user
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ============================================================================
# SKILL RECOMMENDER ENDPOINTS
# ============================================================================

@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    """Get personalized skill recommendations"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        current_skills = data.get('current_skills', [])
        career_goal = data.get('career_goal')
        experience_level = data.get('experience_level', 'intermediate')
        
        if not current_skills:
            return jsonify({"error": "current_skills is required"}), 400
        
        valid_levels = ['beginner', 'intermediate', 'advanced']
        if experience_level not in valid_levels:
            return jsonify({"error": f"experience_level must be one of: {', '.join(valid_levels)}"}), 400
        
        recommendations = get_skill_recommendations(
            current_skills, 
            career_goal, 
            experience_level
        )
        
        return jsonify({
            "success": True,
            "service": "skill_recommender",
            "recommendations": recommendations,
            "user_profile": {
                "current_skills": current_skills,
                "career_goal": career_goal,
                "experience_level": experience_level
            }
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Get all skill categories"""
    return jsonify({
        "success": True,
        "service": "skill_recommender",
        "categories": SKILL_CATEGORIES
    })

@app.route('/api/career-paths', methods=['GET'])
def get_career_paths():
    """Get all career paths and their required skills"""
    return jsonify({
        "success": True,
        "service": "skill_recommender",
        "career_paths": CAREER_PATHS
    })

@app.route('/api/trending-skills', methods=['GET'])
def get_trending_skills():
    """Get trending skills by category"""
    return jsonify({
        "success": True,
        "service": "skill_recommender",
        "trending_skills": TRENDING_SKILLS
    })

@app.route('/api/career-path/<path:career_name>', methods=['GET'])
def get_career_path(career_name):
    """Get specific career path details"""
    career_name = urllib.parse.unquote(career_name)
    
    if career_name in CAREER_PATHS:
        return jsonify({
            "success": True,
            "service": "skill_recommender",
            "career_path": {
                "name": career_name,
                "required_skills": CAREER_PATHS[career_name]
            }
        })
    else:
        return jsonify({"error": "Career path not found"}), 404

@app.route('/api/skills-analysis', methods=['POST'])
def analyze_skills():
    """Analyze user skills and provide insights"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        current_skills = data.get('current_skills', [])
        
        if not current_skills:
            return jsonify({"error": "current_skills is required"}), 400
        
        skill_analysis = {}
        for category, skills in SKILL_CATEGORIES.items():
            matching_skills = [skill for skill in current_skills if skill in skills]
            if matching_skills:
                skill_analysis[category] = {
                    "skills": matching_skills,
                    "count": len(matching_skills),
                    "total_in_category": len(skills)
                }
        
        potential_careers = []
        for career, required_skills in CAREER_PATHS.items():
            matching_required = [skill for skill in required_skills if skill in current_skills]
            coverage = len(matching_required) / len(required_skills) if required_skills else 0
            
            if coverage > 0:
                potential_careers.append({
                    "career": career,
                    "coverage_percentage": round(coverage * 100, 1),
                    "matching_skills": matching_required,
                    "missing_skills": [skill for skill in required_skills if skill not in current_skills]
                })
        
        potential_careers.sort(key=lambda x: x['coverage_percentage'], reverse=True)
        
        return jsonify({
            "success": True,
            "service": "skill_recommender",
            "analysis": {
                "skill_categories": skill_analysis,
                "potential_careers": potential_careers[:5],
                "total_skills": len(current_skills),
                "categories_covered": len(skill_analysis)
            }
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/learning-path', methods=['POST'])
def generate_learning_path():
    """Generate a personalized learning path"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        current_skills = data.get('current_skills', [])
        target_career = data.get('target_career')
        experience_level = data.get('experience_level', 'intermediate')
        
        if not current_skills:
            return jsonify({"error": "current_skills is required"}), 400
        
        recommendations = get_skill_recommendations(
            current_skills, 
            target_career, 
            experience_level
        )
        
        recs = recommendations.get('recommendations', [])
        priority_order = {'High': 3, 'Medium': 2, 'Low': 1}
        sorted_recs = sorted(recs, key=lambda x: priority_order.get(x.get('priority', 'Low'), 1), reverse=True)
        
        learning_path = {
            "phases": [
                {
                    "phase": "Phase 1: Foundation",
                    "skills": [r for r in sorted_recs if r.get('priority') == 'High'][:3],
                    "estimated_time": "3-6 months"
                },
                {
                    "phase": "Phase 2: Specialization", 
                    "skills": [r for r in sorted_recs if r.get('priority') == 'Medium'][:3],
                    "estimated_time": "4-8 months"
                },
                {
                    "phase": "Phase 3: Advanced",
                    "skills": [r for r in sorted_recs if r.get('priority') == 'Low'][:2],
                    "estimated_time": "2-4 months"
                }
            ],
            "total_estimated_time": "9-18 months",
            "recommendations": recommendations
        }
        
        return jsonify({
            "success": True,
            "service": "skill_recommender",
            "learning_path": learning_path
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ============================================================================
# SKILL GAP ANALYZER ENDPOINTS
# ============================================================================

@app.route('/api/analyze', methods=['POST'])
def analyze_gaps():
    """Analyze skill gaps for a target role"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        current_skills = data.get('current_skills', [])
        target_role = data.get('target_role')
        
        if not current_skills:
            return jsonify({"error": "current_skills is required"}), 400
        
        if not target_role:
            return jsonify({"error": "target_role is required"}), 400
        
        analysis = analyze_skill_gaps(current_skills, target_role)
        
        return jsonify({
            "success": True,
            "service": "skill_gap_analyzer",
            "analysis": analysis,
            "user_profile": {
                "current_skills": current_skills,
                "target_role": target_role
            },
            "role_in_database": target_role in JOB_REQUIREMENTS
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/roles', methods=['GET'])
def get_roles():
    """Get all available roles in the database"""
    return jsonify({
        "success": True,
        "service": "skill_gap_analyzer",
        "roles": list(JOB_REQUIREMENTS.keys()),
        "total_roles": len(JOB_REQUIREMENTS)
    })

@app.route('/api/role/<path:role_name>', methods=['GET'])
def get_role_requirements(role_name):
    """Get requirements for a specific role"""
    role_name = urllib.parse.unquote(role_name)
    
    if role_name in JOB_REQUIREMENTS:
        return jsonify({
            "success": True,
            "service": "skill_gap_analyzer",
            "role": {
                "name": role_name,
                "requirements": JOB_REQUIREMENTS[role_name]
            }
        })
    else:
        return jsonify({"error": "Role not found in database"}), 404

@app.route('/api/compare-roles', methods=['POST'])
def compare_roles():
    """Compare skill requirements across multiple roles"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        current_skills = data.get('current_skills', [])
        roles_to_compare = data.get('roles', [])
        
        if not current_skills:
            return jsonify({"error": "current_skills is required"}), 400
        
        if not roles_to_compare:
            return jsonify({"error": "roles is required"}), 400
        
        comparisons = []
        
        for role in roles_to_compare:
            analysis = analyze_skill_gaps(current_skills, role)
            
            readiness = analysis.get('overall_readiness', '0%')
            readiness_level = analysis.get('readiness_level', 'Unknown')
            critical_gaps_count = len(analysis.get('critical_gaps', []))
            matching_skills_count = len(analysis.get('matching_skills', []))
            
            comparisons.append({
                "role": role,
                "readiness": readiness,
                "readiness_level": readiness_level,
                "critical_gaps_count": critical_gaps_count,
                "matching_skills_count": matching_skills_count,
                "in_database": role in JOB_REQUIREMENTS,
                "analysis": analysis
            })
        
        comparisons.sort(key=lambda x: int(x['readiness'].replace('%', '')), reverse=True)
        
        return jsonify({
            "success": True,
            "service": "skill_gap_analyzer",
            "comparisons": comparisons,
            "user_profile": {
                "current_skills": current_skills,
                "total_skills": len(current_skills)
            }
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/skills-overview', methods=['POST'])
def get_skills_overview():
    """Get an overview of skills across different roles"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        current_skills = data.get('current_skills', [])
        
        if not current_skills:
            return jsonify({"error": "current_skills is required"}), 400
        
        role_analyses = {}
        skill_demand = {}
        
        for role, requirements in JOB_REQUIREMENTS.items():
            analysis = analyze_skill_gaps(current_skills, role)
            role_analyses[role] = analysis
            
            for skill in current_skills:
                if skill in requirements.get('essential', []):
                    skill_demand[skill] = skill_demand.get(skill, 0) + 3
                elif skill in requirements.get('preferred', []):
                    skill_demand[skill] = skill_demand.get(skill, 0) + 2
                elif skill in requirements.get('nice_to_have', []):
                    skill_demand[skill] = skill_demand.get(skill, 0) + 1
        
        sorted_skills = sorted(skill_demand.items(), key=lambda x: x[1], reverse=True)
        
        best_matches = []
        for role, analysis in role_analyses.items():
            readiness = int(analysis.get('overall_readiness', '0%').replace('%', ''))
            best_matches.append({
                "role": role,
                "readiness": f"{readiness}%",
                "readiness_level": analysis.get('readiness_level', 'Unknown')
            })
        
        best_matches.sort(key=lambda x: int(x['readiness'].replace('%', '')), reverse=True)
        
        return jsonify({
            "success": True,
            "service": "skill_gap_analyzer",
            "overview": {
                "total_skills": len(current_skills),
                "skill_demand": dict(sorted_skills),
                "best_matching_roles": best_matches[:5],
                "role_analyses": role_analyses
            }
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ============================================================================
# SKILL SWAPPER SPECIFIC ENDPOINTS
# ============================================================================

@app.route('/api/search-users', methods=['POST'])
def search_users():
    """Search and rank users based on keyword matching"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        search_keywords = data.get('keywords', [])
        search_type = data.get('search_type', 'skills')  # 'skills', 'wanted', 'both'
        
        if not search_keywords:
            return jsonify({"error": "keywords array is required"}), 400
        
        # Convert keywords to lowercase for case-insensitive matching
        keywords_lower = [kw.lower() for kw in search_keywords]
        
        ranked_users = []
        
        for user in USERS_DATABASE:
            score = 0
            matched_skills = []
            matched_wanted = []
            
            # Search in user's skills
            if search_type in ['skills', 'both']:
                for skill in user['skills']:
                    skill_lower = skill.lower()
                    for keyword in keywords_lower:
                        if keyword in skill_lower or skill_lower in keyword:
                            score += 1
                            matched_skills.append(skill)
            
            # Search in user's wanted skills
            if search_type in ['wanted', 'both']:
                for wanted_skill in user['skillsWanted']:
                    wanted_lower = wanted_skill.lower()
                    for keyword in keywords_lower:
                        if keyword in wanted_lower or wanted_lower in keyword:
                            score += 0.5  # Lower weight for wanted skills
                            matched_wanted.append(wanted_skill)
            
            if score > 0:
                # Calculate relevance percentage
                total_possible_matches = len(keywords_lower) * (len(user['skills']) + len(user['skillsWanted']))
                relevance_percentage = min(100, (score / total_possible_matches) * 100)
                
                ranked_users.append({
                    "id": user["id"],
                    "name": user["name"],
                    "skills": user["skills"],
                    "skillsWanted": user["skillsWanted"],
                    "match_score": score,
                    "relevance_percentage": round(relevance_percentage, 1),
                    "matched_skills": list(set(matched_skills)),
                    "matched_wanted": list(set(matched_wanted)),
                    "total_matches": len(set(matched_skills + matched_wanted))
                })
        
        # Sort by match score (descending)
        ranked_users.sort(key=lambda x: x['match_score'], reverse=True)
        
        return jsonify({
            "success": True,
            "service": "skill_swapper_search",
            "search_keywords": search_keywords,
            "search_type": search_type,
            "users": ranked_users,
            "total_matches": len(ranked_users),
            "total_users_searched": len(USERS_DATABASE)
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/browse-users', methods=['GET'])
def browse_users():
    """Get all users with basic ranking information"""
    try:
        # Get query parameters
        search = request.args.get('search', '').lower()
        sort_by = request.args.get('sort_by', 'name')  # 'name', 'skills_count', 'match_score'
        
        users = []
        
        for user in USERS_DATABASE:
            user_data = {
                "id": user["id"],
                "name": user["name"],
                "skills": user["skills"],
                "skillsWanted": user["skillsWanted"],
                "skills_count": len(user["skills"]),
                "wanted_count": len(user["skillsWanted"])
            }
            
            # Apply search filter if provided
            if search:
                name_match = search in user["name"].lower()
                skills_match = any(search in skill.lower() for skill in user["skills"])
                wanted_match = any(search in skill.lower() for skill in user["skillsWanted"])
                
                if not (name_match or skills_match or wanted_match):
                    continue
                
                # Calculate basic relevance score for filtered results
                relevance_score = 0
                if name_match:
                    relevance_score += 2
                if skills_match:
                    relevance_score += 1
                if wanted_match:
                    relevance_score += 0.5
                
                user_data["relevance_score"] = relevance_score
            
            users.append(user_data)
        
        # Apply sorting
        if sort_by == 'skills_count':
            users.sort(key=lambda x: x['skills_count'], reverse=True)
        elif sort_by == 'match_score' and search:
            users.sort(key=lambda x: x.get('relevance_score', 0), reverse=True)
        else:
            users.sort(key=lambda x: x['name'].lower())
        
        return jsonify({
            "success": True,
            "service": "skill_swapper_browse",
            "users": users,
            "total_users": len(users),
            "search_applied": bool(search),
            "sort_by": sort_by
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ============================================================================
# UNIFIED ENDPOINTS
# ============================================================================

@app.route('/api/comprehensive-analysis', methods=['POST'])
def comprehensive_analysis():
    """Get comprehensive analysis using all three services"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        current_skills = data.get('current_skills', [])
        target_role = data.get('target_role')
        career_goal = data.get('career_goal')
        experience_level = data.get('experience_level', 'intermediate')
        desired_skills = data.get('desired_skills', [])
        
        if not current_skills:
            return jsonify({"error": "current_skills is required"}), 400
        
        # Run all three analyses
        results = {}
        
        # 1. Skill Gap Analysis
        if target_role:
            results['gap_analysis'] = analyze_skill_gaps(current_skills, target_role)
        
        # 2. Skill Recommendations
        results['recommendations'] = get_skill_recommendations(
            current_skills, career_goal, experience_level
        )
        
        # 3. Skill Matching (if desired skills provided)
        if desired_skills:
            matches = find_skill_matches(current_skills, desired_skills)
            if matches is None:
                matches = fallback_matching(current_skills, desired_skills)
            results['skill_matches'] = matches
        
        return jsonify({
            "success": True,
            "service": "unified",
            "comprehensive_analysis": results,
            "user_profile": {
                "current_skills": current_skills,
                "target_role": target_role,
                "career_goal": career_goal,
                "experience_level": experience_level,
                "desired_skills": desired_skills
            }
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/data-summary', methods=['GET'])
def get_data_summary():
    """Get summary of all available data"""
    return jsonify({
        "success": True,
        "service": "unified",
        "data_summary": {
            "users": {
                "count": len(USERS_DATABASE),
                "description": "Users available for skill matching"
            },
            "skill_categories": {
                "count": len(SKILL_CATEGORIES),
                "categories": list(SKILL_CATEGORIES.keys())
            },
            "career_paths": {
                "count": len(CAREER_PATHS),
                "paths": list(CAREER_PATHS.keys())
            },
            "job_roles": {
                "count": len(JOB_REQUIREMENTS),
                "roles": list(JOB_REQUIREMENTS.keys())
            },
            "trending_skills": {
                "categories": list(TRENDING_SKILLS.keys())
            }
        }
    })

if __name__ == '__main__':
    # Run the unified Flask app
    print("Starting Unified Skills API...")
    print("="*60)
    print("🎯 UNIFIED SKILLS API - All Services Combined")
    print("="*60)
    print("\nAvailable Services:")
    print("  🔗 Skill Matcher - Find users with complementary skills")
    print("  🎯 Skill Recommender - Get personalized skill recommendations")
    print("  🔍 Skill Gap Analyzer - Analyze skill gaps for any role")
    print("\nKey Endpoints:")
    print("  GET  /health - Health check")
    print("  GET  /api/status - Detailed API status")
    print("  POST /api/comprehensive-analysis - All services combined")
    print("  GET  /api/data-summary - Summary of available data")
    print("\nSkill Matcher Endpoints:")
    print("  POST /api/matches - Find skill matches")
    print("  GET  /api/users - Get all users")
    print("  GET  /api/user/<id> - Get specific user")
    print("  POST /api/add-user - Add new user")
    print("\nSkill Recommender Endpoints:")
    print("  POST /api/recommendations - Get skill recommendations")
    print("  GET  /api/categories - Get skill categories")
    print("  GET  /api/career-paths - Get career paths")
    print("  GET  /api/trending-skills - Get trending skills")
    print("  POST /api/skills-analysis - Analyze skills")
    print("  POST /api/learning-path - Generate learning path")
    print("\nSkill Gap Analyzer Endpoints:")
    print("  POST /api/analyze - Analyze skill gaps")
    print("  GET  /api/roles - Get available roles")
    print("  GET  /api/role/<name> - Get role requirements")
    print("  POST /api/compare-roles - Compare roles")
    print("  POST /api/skills-overview - Get skills overview")
    print("\nSkill Swapper Endpoints:")
    print("  POST /api/search-users - Search users by keywords")
    print("  GET  /api/browse-users - Browse all users with filtering")
    print("\nExample Usage:")
    print("  curl -X POST http://localhost:5013/api/comprehensive-analysis \\")
    print("    -H 'Content-Type: application/json' \\")
    print("    -d '{\"current_skills\": [\"JavaScript\", \"React\"], \"target_role\": \"Full Stack Developer\", \"career_goal\": \"Full Stack Developer\", \"experience_level\": \"intermediate\"}'")
    
    app.run(debug=True, host='0.0.0.0', port=5013) 